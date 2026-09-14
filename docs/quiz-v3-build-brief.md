# Build brief — the Starting Picture funnel (web quiz v3)

> **You are the builder.** The architecture, screens, copy, branching, and every decision are in the blueprint; do not re-litigate them. Where the blueprint leaves something to Yarin (§12), ask Yarin, do not choose. Where it is silent on an implementation detail, choose the boring option and note it in the PR.
>
> **Read first, in this order:**
> 1. `/Users/yarinlevy/Desktop/rythma/marketing/quiz-v3-starting-picture-funnel.md` (the blueprint; read all of it once, then keep §4, §5, §8 open)
> 2. `/Users/yarinlevy/Desktop/rythma/marketing/web-funnel-app-handout.md` §2 only (the endpoint contract you call; the app session builds those functions)
> 3. `/Users/yarinlevy/Desktop/rythma/docs/rythma-grok-handout.md` §3, §7, §8 (vocabulary, voice laws, claims rules)
> 4. This file
>
> Add the app folder as a working directory so you can read them: `/add-dir /Users/yarinlevy/Desktop/rythma`. Never edit anything in that folder from this session.

---

## 1. What exists and what stays

The live `/quiz` is a 14-screen funnel whose *architecture* is exactly right and is kept. Read these before writing anything:

| File | Keep |
|---|---|
| `src/app/quiz/page.tsx`, `layout.tsx` | One URL, `noindex`, neutral title/description/keywords override. Keep the metadata comment block; it explains why. |
| `src/components/quiz/quiz-app.tsx` | Server-rendered shell + `ssr:false` engine chunk, state in memory, attribution capture. Keep the pattern. |
| `src/components/quiz/landing.tsx` + `src/lib/quiz-landing.ts` | The landing module must stay import-free of every other quiz module (no health copy in the HTML). Same rule for the new mini LP. |
| `src/components/quiz/quiz-engine.tsx` | Step union, auto-advance after 340ms, back-to-previous-question, timers cleanup, one `Lead` per completer. Extend, don't rewrite. |
| `src/lib/quiz-analytics.ts` | Meta ↔ PostHog mirror, `haptic()`, attribution in `localStorage`, `newEventId()` for CAPI dedup. Extend. |
| `src/app/api/quiz-lead/route.ts` | Resend audience + internal notification + CAPI `Lead` with hashed email. Extend into the profile write. |
| `src/lib/quiz-lead-email.ts` | Gmail-dark-mode-safe email pattern (fills only). Reuse for the Starting Picture email. |
| `src/components/posthog-provider.tsx`, `next.config.ts` | PostHog through the `/ingest` proxy. Don't touch. |
| `src/app/layout.tsx` | Meta Pixel + fonts. Add the two new fonts here the same self-hosted way (`app/fonts/`). |

The old 14-screen funnel stays reachable until cutover: build v3 behind `NEXT_PUBLIC_QUIZ_V3=1`, on branch `quiz-v3`. Don't delete the old files until Yarin says cut over.

---

## 2. Milestones, in order, each shippable behind the flag

### M1 — Skeleton with stills (no payment, no email)
- Fonts: Instrument Serif (regular + italic) and Archivo variable, self-hosted like Inter/Newsreader. Scope the funnel's tokens (blueprint §2, **the decided version: white single theme, solid green primary buttons, lime as highlight only, 19px body, 15px minimum, solid secondary inks that clear AA**) to a `.sp` root class on the quiz shell so the marketing site is untouched. Add a Vitest that computes WCAG contrast for every text token in `tokens.ts` against `#FFFFFF` and fails below 4.5:1. No dark-mode CSS anywhere in the funnel; paint the background explicitly.
- `src/lib/sp/` (new): `landing.ts` (LP strings only, import-free), `data.ts` (acts, screens, options with the app enum raw values from the app handout §2 table, branch tables), `reveal.ts` (pure `buildStartingPicture(answers)` → count, categories, unknowns, candidate test, plan order), `copy-guards.ts` (the banned-substring list: `App Store`, `review`, `rating`, `★`, `4.9`, `%`, `cure`, `treat`, `reduce`, `fix`, `clinically`, `diagnos`).
- Engine: extend the step union with `echo`, `video`, `advertorial`, `method`, `loader`, `gate`, `reveal`, `plan-cards`, `quotes`, `bridge`, `plan`, `checkout`, `handoff`. Section rail on question screens only. Screen 10a is a fork, not a step (rail count unchanged).
- Video component with poster + caption + honesty line; when `src` is empty it renders the still. Continue at 3s. 25% progress events. `playsinline muted autoplay loop={false}`.
- All 31 screens render with the blueprint copy. Dev `?screen=<id>` deep link works (non-production only, as today).
- Tests: add Vitest. `reveal.test.ts` covers every candidate-test rule, category weighting, N=0/1/many grammar, and that no string produced by `data.ts` or `reveal.ts` contains a banned substring. `landing.test.ts` asserts the LP module imports nothing from `data.ts`.
- Acceptance: `curl -s https://<preview>/quiz | grep -iE 'perimenopause|menopause|hormone|symptom|hot flash'` returns nothing. iPhone Safari and the Instagram in-app browser both run the whole flow with stills.

### M2 — Profile and the first email
- Screen 24 posts to `/api/quiz-lead` (renamed internally to `/api/sp/profile` if you like; keep the old route working for the old funnel). The route: validates ids against the enum lists, calls `web-profile-upsert` on the app's Supabase (§2b) (URL and `x-rythma-web-key` from env; mock with an in-memory map when `SP_PROFILE_API_URL` is unset), adds the Resend contact, sends the *Your Starting Picture* email, sends the internal notification, fires CAPI `Lead` with the browser `event_id`.
- Email: the Starting Picture card in HTML, fills only, plus **Open in Rythma** → `https://rythma.co/open?t=<link_token>` from the upsert response (§2b); if the response has no token yet, omit the button.
- Acceptance: a submitted profile round-trips through the mock with the exact enum values; the email renders in Gmail iOS dark mode without inverted text.

### M3 — Stripe checkout, webhook, code, handoff
- Stripe products: `annual` ($59.99/yr, **3-day trial**, Yarin's decision), `monthly` ($9.99/mo, no trial). Prices come from one config object `src/lib/sp/pricing.ts` and are asserted equal to Stripe's price objects by a script (`scripts/check-stripe-prices.mjs`) run in `prebuild`.
- Screen 30: **embedded** Stripe Checkout (`@stripe/stripe-js` + `@stripe/react-stripe-js`, `ui_mode: 'embedded'`), session created by `/api/sp/checkout` with `client_reference_id = rythma_id`, `customer_email` prefilled, `automatic_tax` on, `payment_method_types` left to Stripe so Apple Pay / Google Pay appear. Our recap block above the form per the blueprint.
- `/api/sp/stripe-webhook`: verify signature; on `checkout.session.completed` call `web-profile-paid` (§2b, including `manage_url`), send the *You're in. Here's your code* email, fire CAPI `StartTrial` (or `Purchase` for monthly) server-side with `value`/`currency` only; on `customer.subscription.updated/deleted` and `invoice.payment_failed` mirror to PostHog. Idempotent by Stripe event id.
- Screen 31 with the code (fetched by polling `/api/sp/profile/:rythma_id/status` every 2s after success until `paid`, max 30s, then "check your email").
- `/open` route: `?t=<token>` → if the app handles universal links it never reaches us; otherwise redirect to the App Store, and set nothing in the URL that is health-flavoured. Serve `/.well-known/apple-app-site-association` (JSON, no extension, `application/json`) with the app's team id + bundle id `co.rythma.rythma` (team id from Yarin).
- Path B flag: `NEXT_PUBLIC_CHECKOUT_PATH=B` swaps screens 30–31 for a single App Store handoff. Keep it compiling.
- Acceptance: Stripe test mode end to end on a phone with Apple Pay in sandbox; webhook retry returns the same code; abandoning checkout returns to screen 29 with the monthly row highlighted once.

### M4 — Analytics and Meta
- Events exactly as blueprint §10, snake_case, through the existing `ph()` helper. Meta: `ViewContent` on the LP, `Lead` once at 24, `InitiateCheckout` at 29's CTA, purchase events **server-side only**. Zero custom parameters on any Meta event. Assert this in a unit test that wraps `fbq`.
- Person property `quiz_age_band`. Never email, never symptoms, on the person.
- Save one PostHog funnel insight (LP → started → 7 → 24 → 25 → 29 → checkout completed → app store redirect) in the website project (id 454280) and paste its link in the PR.

### M5 — Cutover checklist (don't do it, prepare it)
- Old funnel files deleted in a separate PR after Yarin's word.
- Lighthouse mobile ≥ 90 performance on the LP; LCP is the headline, so no web font blocks it (use `font-display: swap`, preload the two woff2).
- Reduced-motion pass, VoiceOver pass on the chips and the rail.

---

## 2b. The Supabase contract, as built (read this before M2; it supersedes the handout's example JSON)

The app session shipped the four functions on the app repo's `feat/web-funnel` branch. The live contract is `/Users/yarinlevy/Desktop/rythma/marketing/web-funnel-app-handout.md` §2 (reconciled 2026-09-10) and is pinned by `rythma/supabase/functions/_shared/web-profile.ts` + its Deno tests; when in doubt, that file wins. What you call:

| | |
|---|---|
| Base URL | `${SP_PROFILE_API_URL}` = `https://<project>.supabase.co/functions/v1` |
| Auth header | `x-rythma-web-key: ${SP_PROFILE_API_KEY}` |
| Screen 24 | `POST /web-profile-upsert` → `{ rythma_id, link_token }` (the app session is adding `link_token` to the response; until it lands, treat a missing `link_token` as "no Open in Rythma button in the first email") |
| Stripe webhook | `POST /web-profile-paid` → `{ code, link_token }`, idempotent per `stripe_subscription_id` |

**Values you send are the app's enum raw values, verbatim.** Answer keys that are validated: `age` (`underThirtyEight … fiftySixPlus`), `intensity` (`annoying | seriouslyDisrupting | losingControl`), `cycle` (`regular | irregular | cantRemember | stopped | noPeriods`), `no_period_reason` (only with `noPeriods`: `hysterectomy | ablationOrIUD | stopped12Months | hrtContinuous | other`), `tracking` (`usingAppDoesntWork | notesOrCalendar | triedGaveUp | dontKnowWhereToStart`), `doctor` (`helpfulDoctor | feltDismissed | notYet | didntKnow`), `matters` (`hardDayPredictions | understandBody | doctorEvidence | feelLessAlone`). Keep the web-only keys (`moment, how_long, harder, inputs, reflection`) in `answers` too; they are stored as given. `symptoms[]` = the 30 `Symptom` raw values (`sleepDisruption`, `tinnitus`, `rage`, …). `candidate_test` ∈ `caffeine_cutoff | alcohol_free | screen_curfew | early_dinner | morning_walk | wind_down`. A bad id returns `400 { error: "invalid", field, message }`; surface `field` in the server log, never to her.

**Three things this changes in the milestones:**
1. **M2 email:** the *Open in Rythma* button is `https://rythma.co/open?t=<link_token>`. Before payment that link opens the app into a prefilled, quiz-skipped path that still shows the app's own paywall (the app returns `402`); after payment it becomes single-use. That is the abandoner rescue, so send it.
2. **M3 webhook:** send `manage_url` to `web-profile-paid`. **Not** a Stripe portal session URL (they expire in minutes). Build `GET /manage?k=<signed rythma_id>` (HMAC with `UNSUBSCRIBE_SECRET`'s sibling, add `SP_MANAGE_SECRET`) that creates a Stripe billing-portal session on demand and redirects. The app opens this for "Managed on the web → Manage".
3. **M3 handoff:** screen 31 shows the `code` returned by `paid`. Codes are six digits, 24h, five attempts, and redeemed together with the email she paid with; say "the email you used here" on 31 so she uses the same one.

Mock both functions in-process when `SP_PROFILE_API_URL` is unset, with the exact status codes above.

## 3. Env (add to `.env.example` with comments, values from Yarin)

```
NEXT_PUBLIC_QUIZ_V3=1
NEXT_PUBLIC_CHECKOUT_PATH=A
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ANNUAL=
STRIPE_PRICE_MONTHLY=
SP_PROFILE_API_URL=        # the app's Supabase functions base URL; unset = in-memory mock
SP_PROFILE_API_KEY=        # sent as x-rythma-web-key (= the app project's RYTHMA_WEB_KEY secret)
SP_MANAGE_SECRET=          # signs /manage?k= links sent to the app as manage_url
APPLE_TEAM_ID=             # already in .env.example from the Paddle starter; reuse for AASA
```
Existing `RESEND_*`, `META_*`, `NEXT_PUBLIC_POSTHOG_*`, `UNSUBSCRIBE_SECRET` stay as they are. Remove the dead Paddle variables and `src/hooks/use-paddle*` in the cutover PR, not before.

---

## 4. Rules that override your judgment

0. **One landing page, one headline, no ad variants** (Yarin, 2026-09-10). No `?a=` param, no per-ad copy. If a headline test is wanted later it runs behind a PostHog flag on the page, never through the URL.

1. **Every user-facing string comes from the blueprint.** If you need a string it doesn't have (an error state, a loading label), write it in the blueprint's voice, run it through the banned list, and list it in the PR under "new strings for Yarin".
2. **No health terms in server HTML, URLs, query strings, event properties sent to Meta, or the `<title>`.** The LP module stays import-free.
3. **Web never shows a Peri Score number or band, a stage, an outcome statistic, a star, or the word "review".** The tests enforce this; keep them green.
4. **Prices, trial length, plan names come from `pricing.ts` only** and are checked against Stripe in `prebuild`.
5. **One `Lead` per completer; purchase events server-side only.**
6. **Don't touch the marketing site, the blog, or the PostHog provider.** The funnel is scoped by the `.sp` class and the flag.
7. **Enum raw values are the app's, verbatim** (app handout §2 table). The web maps its labels at write time in `data.ts`, nowhere else.
8. **Branch `quiz-v3`, one PR per milestone, no force-push, no commits to `main`.** Each PR description lists: what shipped, new strings for Yarin, decisions you made because the blueprint was silent.
9. **When something in the blueprint can't be built as written, stop and say so** with the smallest change that would make it buildable. Don't silently redesign.
