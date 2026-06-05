import { Resend } from "resend";
import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/quiz-data";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
// Where the internal "new lead" notification (with full answers + UTMs) is sent.
const NOTIFY_EMAIL = process.env.QUIZ_LEAD_NOTIFY_EMAIL || "hello@rythma.co";
const FROM = "Rythma <hello@rythma.co>";

type Payload = {
  email?: string;
  age?: string;
  answers?: Record<string, string>;
  attribution?: Record<string, string>;
};

/** Map a stored answer value back to its human label for the notification. */
function labelFor(questionId: string, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  const opt = q?.options.find((o) => o.value === value);
  return opt?.label ?? value;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const { email, age, answers = {}, attribution = {} } = (await request.json()) as Payload;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // 1) Add to the Resend Audience (the nurture list). Best-effort — a failure
    //    here (e.g. already a contact) must not block the lead.
    if (AUDIENCE_ID) {
      try {
        await resend.contacts.create({ email, audienceId: AUDIENCE_ID, unsubscribed: false });
      } catch (e) {
        console.error("quiz-lead: contact create failed", e);
      }
    }

    // 2) Welcome email to the lead — warm, on-brand, no health assertions.
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Your place in Rythma is saved",
        html: welcomeEmailHtml(),
      });
    } catch (e) {
      console.error("quiz-lead: welcome email failed", e);
    }

    // 3) Internal notification — durable attribution record (Resend Audience
    //    contacts can't store custom fields, so we persist the detail by email).
    const answerRows = QUESTIONS.map((q) => {
      const v = answers[q.id];
      return `<tr><td style="padding:4px 12px 4px 0;color:#6B7070;">${escapeHtml(q.id)}</td><td style="padding:4px 0;color:#1A1C1C;">${v ? escapeHtml(labelFor(q.id, v)) : "—"}</td></tr>`;
    }).join("");
    const utmRows = Object.entries(attribution)
      .map(
        ([k, val]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#6B7070;">${escapeHtml(k)}</td><td style="padding:4px 0;color:#1A1C1C;">${escapeHtml(String(val))}</td></tr>`,
      )
      .join("");

    try {
      await resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        subject: `New quiz lead: ${email}${age ? ` (${age})` : ""}`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1A1C1C;">
            <h2 style="margin:0 0 8px;">New quiz lead</h2>
            <p style="margin:0 0 16px;"><strong>${escapeHtml(email)}</strong></p>
            <h3 style="margin:16px 0 4px;font-size:14px;color:#00464A;">Answers</h3>
            <table style="border-collapse:collapse;font-size:14px;">${answerRows}</table>
            <h3 style="margin:16px 0 4px;font-size:14px;color:#00464A;">Attribution</h3>
            <table style="border-collapse:collapse;font-size:14px;">${utmRows || '<tr><td style="color:#6B7070;">none</td></tr>'}</table>
          </div>
        `,
      });
    } catch (e) {
      console.error("quiz-lead: notification email failed", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("quiz-lead error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

function welcomeEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#F9F9F8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9F8;padding:40px 20px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
            <tr><td style="padding:40px 40px 24px;text-align:center;background:linear-gradient(135deg,#f0f9f9 0%,#ffffff 100%);">
              <h1 style="margin:0;font-size:28px;font-weight:600;color:#00464A;">Rythma</h1>
            </td></tr>
            <tr><td style="padding:0 40px 40px;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#1A1C1C;">You belong here.</h2>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4b5563;">
                You took a moment to be honest about how you've been feeling — and that takes courage. What you're feeling is real, and you're not alone in it.
              </p>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#4b5563;">
                Your place is saved. When you're ready, the app takes it from here — gently, at your own pace.
              </p>
              <p style="text-align:center;margin:0;">
                <a href="https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611" style="display:inline-block;background-color:#00464A;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;border-radius:9999px;">Download Rythma</a>
              </p>
            </td></tr>
            <tr><td style="padding:24px 40px;background-color:#F9F9F8;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:14px;color:#9ca3af;text-align:center;">
                Built for perimenopause. Built for you.<br><strong style="color:#4b5563;">The Rythma Team</strong>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}
