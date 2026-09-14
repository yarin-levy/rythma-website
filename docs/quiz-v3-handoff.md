# Starting Picture funnel — handoff to the second builder session (2026-09-14)

> **You are the builder for the verification and cutover phase.** The first builder session built M1–M5 and ran out of context. Nothing is merged yet. Your job is to take the stacked PRs to production safely, support Yarin's real-world verification, and execute the cutover when he says so. The architect (a separate Claude session in this same repo, run by Yarin) owns decisions; Yarin owns merges, secrets and dashboards.
>
> **Read first, in this order, then start at §4 of this file:**
> 1. `docs/quiz-v3-build-brief.md` (the rules you work under; §2b is the Supabase contract as built; §4 rules override your judgment)
> 2. `docs/quiz-v3-cutover.md` (on branch `quiz-v3-m5`; the checklist you will help execute)
> 3. `/Users/yarinlevy/Desktop/rythma/marketing/quiz-v3-starting-picture-funnel.md` §4, §8, §10, §12 (the design, the identity contract, the analytics, the decisions)
> 4. `/Users/yarinlevy/Desktop/rythma/marketing/web-funnel-app-handout.md` §2 (the five edge functions, as built)
>
> Run `/add-dir /Users/yarinlevy/Desktop/rythma` to read the last two. Never edit anything in that folder.

---

## 1. Where things stand

**Website repo, branch stack (all open, all green, 376 tests):**

| PR | Branch | Base | What it is |
|---|---|---|---|
| #20 | `quiz-v3` | `main` | M1: 31 screens with stills behind `NEXT_PUBLIC_QUIZ_V3` |
| #21 | `quiz-v3-m2` | `quiz-v3` | M2: profile write (`web-profile-upsert`), Starting Picture email |
| #22 | `quiz-v3-m3` | `quiz-v3-m2` | M3: embedded Stripe Checkout, webhook, code via `web-profile-status`, `/open`, AASA, Path B flag |
| #23 | `quiz-v3-m4` | `quiz-v3-m3` | M4: analytics per blueprint §10, Meta events, saved PostHog insight |
| #24 | `quiz-v3-m5` | `quiz-v3-m4` | M5: Lighthouse 91, reduced motion, VoiceOver markup, deletion dry-run, `docs/quiz-v3-cutover.md` |

Yarin merges them in order when he gets to it. If he merges #20 first and the others need a rebase, do it with plain `git rebase --onto` per branch and re-push; don't squash the stack.

**App repo (`/Users/yarinlevy/Desktop/rythma`):** PR #20 on `feat/web-funnel`, open, holds the migration, all **five** edge functions (`web-profile-upsert`, `-paid`, `-status`, `-redeem`, `-link`), the app's "I already joined on the web" door, and the no-steering audit. Not deployed. Not your repo; read only.

**Live today:** `rythma.co/quiz` still serves the old 14-screen v2 funnel. Nothing v3 is visible to visitors until the flag flips.

## 2. Beliefs from the previous session that are stale — drop them

- "The app still owes `web-profile-status`." It shipped in the app's PR #20 on 2026-09-14.
- "`variant` must become optional on `web-profile-upsert`." It was always optional. There are no LP variants (Yarin's decision, 2026-09-10; brief §4 rule 0).
- "I need the Stripe keys / webhook secret / Team ID." You never do. Secrets go into Vercel; you read them from `process.env`. Never ask for a secret in chat and never paste one.
- "The web sells 7 days." The trial is **3 days**, web and app alike.

## 3. Standing rules (in addition to brief §4)

1. **One page, one headline, no ad variants.** No `?a=`, no per-ad copy.
2. **No secrets in chat, ever.** If a step needs a value, tell Yarin which Vercel variable to set and wait.
3. **PostHog key is Production-only.** `NEXT_PUBLIC_POSTHOG_KEY` must not be set for Preview in Vercel, and must be blank in `.env.local`. The website project (454280) already holds test events from the previous session's local runs; the saved insight filters on `$host = rythma.co`, and any new analysis must too. Do not delete events.
4. **Don't wait between tasks.** Stack work on the previous branch, open the PR, keep going. Stop only for something Yarin must do (a merge, a secret, a dashboard, a device).
5. **Strings:** any new user-facing sentence goes through `copy-guards.ts` and is listed in the PR under "new strings for Yarin". Trial is 3 days; prices come only from `pricing.ts`.
6. **When the blueprint or the brief can't be built as written, stop and say so** with the smallest change that would make it buildable. Bring it to Yarin, who brings it to the architect. Don't redesign.
7. **Rule 6 of the brief still holds:** no changes to the marketing site, the blog, the root layout or the PostHog provider. The `/quiz` route-group idea for the font preloads is Yarin's call, not yours.

## 4. Your queue, in order

### 4.1 Housekeeping PR (small, on top of `quiz-v3-m5`)
- `.env.example`: comment on `NEXT_PUBLIC_POSTHOG_KEY` saying Production-only in Vercel, blank locally.
- Brief §3: the same note (one line).
- `docs/quiz-v3-handoff.md` (this file) stays; update its §1 table if PR numbers change.

### 4.2 Sandbox verification (starts when Yarin says the Stripe test values are in Vercel, Preview scope)
Yarin is doing, in Stripe **test mode**: keys, two prices, a webhook pointing at the M3-or-later preview alias + `/api/sp/stripe-webhook`, portal on. Then the six Vercel values from brief §3, Preview and Production. Then he'll say "Stripe done".
Your part:
1. Confirm the preview deploy picks up the variables: screen 30 must render the Checkout, not the "can't take payment" state. `scripts/check-stripe-prices.mjs` must pass in `prebuild` against the test prices.
2. Walk the happy path yourself on the preview with `4242 4242 4242 4242`: profile written (mock until `SP_PROFILE_API_URL` exists, then real), webhook delivered (Stripe → Developers → Webhooks shows 200), code email sent, screen 31 shows the code. Fix anything that breaks; each fix is a commit on the current top branch.
3. Replay the same Stripe event and prove the code is unchanged and only one email went out.
4. Back out of checkout: screen 29, monthly highlighted once.
5. Write Yarin a numbered device script for what only he can do: Apple Pay on a real iPhone, iPhone Safari and the Instagram in-app browser end to end, the two emails in Gmail on iOS, VoiceOver on screen 7 and the rail. Keep it to one screen of text.
6. When `SP_PROFILE_API_URL` and `SP_PROFILE_API_KEY` arrive (after the app side deploys), remove nothing: the mock steps aside on its own. Re-run 2 and 3 against the real functions.

### 4.3 Apple Pay domain
Stripe's "Add domain" for Apple Pay hands Yarin a verification file. Host it at `/.well-known/apple-developer-merchantid-domain-association` (no extension, exact bytes). Tell Yarin when it's deployed so he can click Verify. This needs a deployed branch on a real domain; a preview alias works for test mode.

### 4.4 Universal links
After M3 is on production and `APPLE_TEAM_ID` is set: `curl -s https://rythma.co/.well-known/apple-app-site-association` must show `"appID":"2562M24Y6M.co.rythma.rythma"` and the `/open*` path. Report the output.

### 4.5 Cutover (only on Yarin's explicit "cut over")
Follow `docs/quiz-v3-cutover.md` §1 gates → §2 flip. You do the code and curl checks; Yarin sets the Production variables and redeploys. Then the deletion PR per §4 of that file, only after his second explicit word. Rollback is in §2 of that file; know it before you flip.

### 4.6 The first two weeks
Watch the saved insight (`https://us.posthog.com/project/454280/insights/ncRE7Kek`), Stripe webhook failures (`PAID BUT NOT RECORDED` in logs), Meta Events Manager dedup. Floors are in blueprint §10 and cutover §3. A screen under its floor for a week at 200+ starters gets rewritten, not removed. Bring findings to Yarin; the architect decides copy changes.

## 5. What Yarin owes, so you know what to wait for and never ask for in chat

Stripe test values in Vercel (5) · `APPLE_TEAM_ID = 2562M24Y6M` · `SP_MANAGE_SECRET` · later `SP_PROFILE_API_URL` + `SP_PROFILE_API_KEY` (after the app's Supabase deploy) · merges of #20–#24 in order · the app's PR #20 merged and a TestFlight/App Store build with the web door · the RevenueCat Stripe app · the live-mode Stripe prices and webhook at cutover.

## 6. How to report
One message per completed step: what changed, what you verified and how, what you need next (a Vercel variable name, a merge, a device step). No secrets, no restating the plan.
