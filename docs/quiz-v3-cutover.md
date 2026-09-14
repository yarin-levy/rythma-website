# Starting Picture funnel — cutover checklist

> Prepared in M5 (build brief §2, "don't do it, prepare it"). **Nothing in this file has been done.** Every step is Yarin's to take, in order. The code-side preparation it depends on is already merged into the M5 branch: v3 no longer imports anything from v2, and a guard test keeps it that way, so the deletion in §4 is a pure deletion.

---

## 1. Gates — all true before the flip

**Merged, in order:** #20 (M1) → #21 (M2) → #22 (M3) → #23 (M4) → #24 (M5).

**App side**
- [ ] The four `web-profile-*` edge functions live in the app's Supabase (app PR #20).
- [ ] Associated Domains entitlement `applinks:rythma.co` in `rythma.entitlements`, set in the developer portal.
- [ ] An app build with **I already joined on the web** is live on the App Store — otherwise screen 31 sends her to an app that can't redeem the code.

**Vercel → Production environment only**
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ANNUAL`, `STRIPE_PRICE_MONTHLY`
- [ ] `SP_PROFILE_API_URL`, `SP_PROFILE_API_KEY` (unset = the in-memory mock, which must never run in production)
- [ ] `SP_MANAGE_SECRET` (any long random string; changing it later breaks every Manage link already stored in the app)
- [ ] `APPLE_TEAM_ID`
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` stays Production-only (brief §3)
- [ ] `prebuild` runs `scripts/check-stripe-prices.mjs` — a deploy **fails** if Stripe's prices disagree with `pricing.ts`. That is the intended behaviour.

**Stripe dashboard**
- [ ] Webhook endpoint `https://rythma.co/api/sp/stripe-webhook` subscribed to `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Prices: $59.99/year and $9.99/month. **No trial on the price** — the session sets 3 days from `pricing.ts`
- [ ] Stripe Tax on · customer portal on, with cancel allowed · Apple Pay domain `rythma.co` verified

**Verified on real things** (none of these can be done by the builder)
- [ ] Stripe **test mode**, end to end, on a phone with Apple Pay — brief M3 acceptance: a webhook retry returns the same code; backing out of checkout lands on screen 29 with the monthly row highlighted once; the code redeems in the app
- [ ] The whole flow in **iPhone Safari** and the **Instagram in-app browser**
- [ ] One live send of each email to Gmail on iOS: *Your Starting Picture* and *You're in. Here's your code*
- [ ] VoiceOver on a device over screen 7 (chips) and the rail — M5 covered this with axe on all 31 screens plus a markup audit, which is a proxy, not the real thing
- [ ] `curl -s https://rythma.co/.well-known/apple-app-site-association` shows `"appID":"<TEAM>.co.rythma.rythma"` and `"paths":["/open*"]` — not `undefined`

---

## 2. The flip

`NEXT_PUBLIC_*` is inlined at build time, so each step below is **set the variable, then redeploy**.

1. Vercel Production: `NEXT_PUBLIC_QUIZ_V3=1`, `NEXT_PUBLIC_CHECKOUT_PATH=A`. Redeploy.
2. Check the live page:
   - `curl -s https://rythma.co/quiz | grep -ciE 'perimenopause|menopause|hormone|symptom|hot flash'` → `0`
   - The `<h1>` reads *You're not going mad. Tracking alone was never enough.*
   - `https://rythma.co/quiz?screen=reveal` opens the **landing page**, not the reveal — deep links are off when `VERCEL_ENV=production`
   - The page source contains no `js.stripe.com`

**Rollback, all of it:** unset `NEXT_PUBLIC_QUIZ_V3`, redeploy. The v2 quiz is still in the codebase until §4.
**Rollback, payments only:** `NEXT_PUBLIC_CHECKOUT_PATH=B`, redeploy. Screens 30–31 become a single App Store handoff and nobody pays on the web.

---

## 3. The first two weeks

- **PostHog:** [Starting Picture funnel — LP to App Store](https://us.posthog.com/project/454280/insights/ncRE7Kek). Browser steps are filtered to `$host = rythma.co`, because 454280 holds old test events from `localhost`. Filter any new analysis the same way.
- **Floors** (blueprint §10). Below one for a week at ≥ 200 starters, that screen gets rewritten; the funnel doesn't get shortened.
  LP → started 55% · started → symptoms 80% · any video screen ≤ 8% drop · gate views → email 45% · reveal → plan CTA 35% · plan CTA → checkout completed 25% · checkout → code redeemed in 24h 80%
- **Stripe:** Developers → Webhooks → delivery failures. A `500` from us means a profile write failed after payment; Stripe retries, but look at the log line `PAID BUT NOT RECORDED`.
- **Meta Events Manager:** browser `Lead` and `InitiateCheckout`; server `StartTrial` / `Purchase` with deduplication by event id. No custom parameters on any of them.
- **Day 14 (blueprint §9):** re-check the pixel's data-source category. If it flips to *Health & Wellness – Condition*, Lead delivery stops and optimisation falls back to landing-page views.

---

## 4. The deletion PR — after Yarin's word

**Dry-run in M5.** Everything below was applied to a full copy of the M5 branch — the files deleted, the edits made — and checked there:
- **Tests:** all 376 pass.
- **Typecheck:** 0 errors outside the three pages that read Contentlayer's generated output (`blog/page.tsx`, `blog/[slug]/page.tsx`, `sitemap.ts`). The copy had no generated content — Contentlayer's CLI would not run through a symlinked `node_modules`. The same files typecheck clean in the real repo.
- **References:** nothing imports a deleted module; the only remaining mentions are historical comments.
- **Not run in the copy:** `next build`, for the Contentlayer reason above. Run it on the deletion PR as usual.

`src/lib/sp/__tests__/cutover-guards.test.ts` fails the build if any v3 file starts importing v2 again, which keeps this a pure deletion.

**Delete (21 files):**

```
src/components/quiz/                      (the v2 engine, landing, icons, six screens)
src/lib/quiz-analytics.ts
src/lib/quiz-data.ts
src/lib/quiz-landing.ts
src/lib/quiz-lead-email.ts
src/lib/quiz-score.ts
src/app/api/quiz-lead/route.ts
src/hooks/use-paddle.tsx                   Paddle starter — nothing imports it
src/hooks/use-paddle-prices.tsx            Paddle starter — nothing imports it
src/lib/format-trial-period.ts             Paddle starter — nothing imports it
src/lib/format-billing-cycle.ts            Paddle starter — nothing imports it
src/lib/types.ts                           imported only by use-paddle.tsx
```

**Edit:**
- `src/app/quiz/page.tsx` → drop the flag and the v2 branch:
  ```tsx
  import { SpApp } from "@/components/sp/sp-app";

  export default function QuizPage() {
    return <SpApp devLinks={process.env.VERCEL_ENV !== "production"} />;
  }
  ```
- `src/app/globals.css` → delete the `Quiz funnel (/quiz) — iPhone-first` block (`.quiz-shell`, `.quiz-tap`, `quiz-rise`, `quiz-ring-spin`, `quiz-breathe`, `quiz-glow`)
- `src/app/quiz/layout.tsx` → `themeColor: "#FFFFFF"` (no longer conditional)
- `.env.example` → remove `NEXT_PUBLIC_QUIZ_V3`, `NEXT_PUBLIC_PADDLE_ENV`, `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_BUNDLE_IDENTIFIER`, `NEXT_PUBLIC_APP_REDIRECT_URL`
- `package.json` → remove `@paddle/paddle-js`; rename the package from `paddle-mobile-web-payments-starter`
- Vercel → remove `NEXT_PUBLIC_QUIZ_V3` from Production after the deploy lands

**Not in the brief's list, and deliberately kept:** the brief's M5 line about documenting the `?a=` variants no longer applies — rule 0 removed them.

---

## 5. Open, for Yarin

1. **The `<title>` and meta description still describe v2**: *The 2-minute quiz — Rythma* / *Answer a few quick questions and get your personal profile.* v3 is about four minutes and ends in a Starting Picture. They need new neutral strings — no condition terms (blueprint §9), since Meta's crawler reads them. A suggestion to react to, not a decision: *Your Starting Picture — Rythma* / *A few minutes of questions, and a clear starting picture to take with you.*
2. **Lighthouse margin.** Median 91 across three runs on a production build. What's left of the gap is the root layout's Inter and Newsreader (166 KB), preloaded on every route including `/quiz`, which never uses them. The fix is a route group that gives `/quiz` its own root layout. That restructures the marketing site's routes, which rule 6 puts off-limits to the builder, so it's your call.
3. **Accessibility score is 96, not 100**, entirely from `ink3` at 4.11:1 — your recorded exemption.
4. **Keyboard on single-select screens.** The option cards are `role="radio"` buttons without arrow-key movement, so a keyboard user tabs through every option. VoiceOver on a phone is unaffected. A small follow-up, outside M5's chips-and-rail scope.
5. **The repo lives on an iCloud-synced Desktop.** During M5, `git worktree` died with SIGBUS, `git archive` produced truncated tarballs, `rsync` reported `public/avatars/1.jpg: file truncated while reading`, and `.next` keeps growing `… 2.ts` duplicates. That's the signature of *Optimize Mac Storage* evicting files git is reading. Nothing is lost that I can see, but it's a real risk to the repository. Moving it off `~/Desktop`, or excluding the folder from iCloud Drive, removes it.
