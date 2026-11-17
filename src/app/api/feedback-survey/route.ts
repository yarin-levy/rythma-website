import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  COME_BACK_OPTIONS,
  REASON_OPTIONS,
  STATUS_OPTIONS,
  STAY_REASON_OPTIONS,
  labelOf,
  parseSurvey,
} from "@/lib/feedback-survey";

// The app's Supabase project. The anon key is public by design (it ships in the
// iOS app); the table it writes to is insert-only for anon, so nothing can be
// read back with it. Env vars override for a different project.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xvpjkmdrzddwnfhnvtbh.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_nj1uEYnTmmmSMCq34CdsBw_-1acrMAw";

const NOTIFY_EMAIL = process.env.QUIZ_LEAD_NOTIFY_EMAIL || "hello@rythma.co";
const FROM = "Rythma <hello@rythma.co>";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = parseSurvey(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const row = parsed.row;

  // 1) The durable record. If this fails the answer is lost, so it fails the request.
  const res = await fetch(`${SUPABASE_URL}/rest/v1/churn_survey_responses`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error("feedback-survey: insert failed", res.status, await res.text());
    return NextResponse.json({ error: "Couldn't save your answers. Please try again." }, { status: 502 });
  }

  // 2) A copy to the team inbox — best effort, never fails the request.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const reasonLabel = labelOf([...REASON_OPTIONS, ...STAY_REASON_OPTIONS], String(row.main_reason));
      const lines: [string, string][] = [
        ["Status", labelOf(STATUS_OPTIONS, String(row.status))],
        ["From link", String(row.link_group ?? "—")],
        ["Main reason", reasonLabel + (row.reason_other ? ` — ${row.reason_other}` : "")],
        ["Hoped for", String(row.hoped_for ?? "—")],
        ["Liked", String(row.liked ?? "—")],
        [
          "Would bring her back",
          (row.come_back as string[]).map((v) => labelOf(COME_BACK_OPTIONS, v)).join(", ") +
            (row.come_back_other ? ` — ${row.come_back_other}` : "") || "—",
        ],
        ["Follow up", row.contact_ok ? String(row.contact_email ?? "yes (no email given)") : "no"],
      ];
      const html = `<table style="font-family:sans-serif;font-size:14px">${lines
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#6B7070;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#1A1C1C;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`;
      const { error } = await resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        subject: `Feedback survey: ${reasonLabel}`,
        html,
      });
      if (error) console.error("feedback-survey: notify email failed", error);
    } catch (e) {
      console.error("feedback-survey: notify email threw", e);
    }
  }

  return NextResponse.json({ ok: true });
}
