# Feedback survey — emails to send

One email per group. Each links to `rythma.co/feedback?g=<group>`, which skips the
"which describes you" question. The `g` value is the only thing in the URL: no
email, no name, no id.

Send from `hello@rythma.co` (already verified in Resend). Plain text-style, from a
person, no images: these read as a note, not a campaign, and they land in the inbox.

> **Before sending:** about half the list are Apple "Hide My Email" addresses
> (`@privaterelay.appleid.com`). Apple only forwards mail from domains registered in
> the Apple Developer portal → Certificates, IDs & Profiles → Services → Sign in
> with Apple for Email Communication. Register `rythma.co` there (and the Resend
> sending domain if it differs), or those emails silently disappear.

---

## Group 1 — tried the trial, cancelled before paying (46)

**Subject:** Can I ask you one thing?

Hi,

You tried Rythma a little while ago and decided it wasn't for you. That's completely
fine, and I'm not writing to change your mind.

I'm writing because I build Rythma, and the people who leave teach me the most. Would
you tell me what didn't work? It's six short questions, about two minutes:

**rythma.co/feedback?g=trial**

I read every answer myself.

Thank you,
Yarin
Founder, Rythma

---

## Group 2 — paid, then cancelled (51)

**Subject:** What should I have done better?

Hi,

You were a Rythma member for a while, and then you cancelled. Thank you for giving it
a real try.

I'd love to know what changed. Was it the price, the predictions, the daily logging,
or something I haven't thought of? Six short questions, about two minutes:

**rythma.co/feedback?g=paid**

I read every answer myself, and the next version of Rythma will be shaped by them.

Thank you,
Yarin
Founder, Rythma

---

## Group 3 — still subscribed (6) + billing retry (1)

**Subject:** You're one of our first members

Hi,

You've been with Rythma since the early days, and I wanted to say thank you.

I'm deciding what to build next, and I'd love your take: what keeps you using it, and
what do you wish it did? Six short questions, about two minutes:

**rythma.co/feedback?g=active**

Thank you,
Yarin
Founder, Rythma

*(For the one billing-retry member: send the group 3 email. Don't mention billing;
Apple already emails them about the failed payment.)*

---

## Reading the answers

Every response lands in Supabase → Table editor → `churn_survey_responses`, and a copy
is emailed to `QUIZ_LEAD_NOTIFY_EMAIL` (hello@rythma.co by default).
