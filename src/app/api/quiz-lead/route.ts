import { createHash } from "node:crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/quiz-data";
import { computeScore } from "@/lib/quiz-score";
import { unsubscribeUrl } from "@/lib/unsubscribe";
import { profileEmailHtml } from "@/lib/quiz-lead-email";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
// Where the internal "new lead" notification (with full answers + UTMs) is sent.
const NOTIFY_EMAIL = process.env.QUIZ_LEAD_NOTIFY_EMAIL || "hello@rythma.co";
const FROM = "Rythma <hello@rythma.co>";

// Meta Conversions API — the ONLY path by which an email address may reach
// Meta, and it leaves here hashed. The browser pixel fires a bare `Lead` with
// the same event_id, so Meta counts the pair once. No-ops when the token isn't
// configured, which keeps local dev and CI silent.
const META_PIXEL_ID = process.env.META_PIXEL_ID || "862926626501765";
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_CAPI_TEST_CODE = process.env.META_CAPI_TEST_EVENT_CODE;

type Payload = {
  email?: string;
  /** Dedup key shared with the browser pixel's `Lead`. */
  eventId?: string;
  answers?: Record<string, string>;
  symptoms?: string[];
  attribution?: Record<string, string>;
};

/** Map a stored answer value back to its human label for the notification. */
function labelFor(questionId: string, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  const opt = q?.options.find((o) => o.value === value);
  return opt?.label ?? value;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Read a cookie off the raw header — no cookie library needed for two names. */
function cookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

/**
 * Server-side `Lead`. Standard fields only — no custom_data, no score, no
 * answers, nothing health-flavored. Best effort: a failure here must never
 * fail the lead.
 */
async function sendCapiLead(args: {
  email: string;
  eventId?: string;
  request: Request;
}): Promise<void> {
  if (!META_CAPI_TOKEN) return;

  const cookies = args.request.headers.get("cookie");
  const forwardedFor = args.request.headers.get("x-forwarded-for");

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        ...(args.eventId ? { event_id: args.eventId } : {}),
        action_source: "website",
        event_source_url: `${args.request.headers.get("origin") ?? "https://rythma.co"}/quiz`,
        user_data: {
          em: [sha256(args.email.trim().toLowerCase())],
          ...(forwardedFor ? { client_ip_address: forwardedFor.split(",")[0].trim() } : {}),
          ...(args.request.headers.get("user-agent")
            ? { client_user_agent: args.request.headers.get("user-agent") }
            : {}),
          ...(cookie(cookies, "_fbp") ? { fbp: cookie(cookies, "_fbp") } : {}),
          ...(cookie(cookies, "_fbc") ? { fbc: cookie(cookies, "_fbc") } : {}),
        },
      },
    ],
    ...(META_CAPI_TEST_CODE ? { test_event_code: META_CAPI_TEST_CODE } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    console.error("quiz-lead: CAPI rejected the event", res.status, await res.text());
  }
}

export async function POST(request: Request) {
  try {
    const {
      email,
      eventId,
      answers = {},
      symptoms = [],
      attribution = {},
    } = (await request.json()) as Payload;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // The score is recomputed here rather than trusted from the client, so the
    // number in her inbox can never disagree with the one on her screen.
    const score = computeScore(answers, symptoms);
    const origin = request.headers.get("origin") ?? "https://rythma.co";

    // Every Resend call returns { data, error } instead of throwing, so a bare
    // try/catch around them catches nothing and every failure vanishes. These
    // are inspected explicitly and collected.
    const warnings: string[] = [];

    // 1) Meta CAPI — hashed, deduped against the browser pixel. Best-effort.
    try {
      await sendCapiLead({ email, eventId, request });
    } catch (e) {
      console.error("quiz-lead: CAPI send failed", e);
      warnings.push("capi");
    }

    // 2) Add to the Resend Audience (the nurture list).
    let contactStored = false;
    if (!AUDIENCE_ID) {
      console.error(
        "quiz-lead: RESEND_AUDIENCE_ID is not set — this lead was NOT added to any list",
      );
      warnings.push("audience-not-configured");
    } else {
      const { error } = await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
      if (error) {
        // An address already on the list is a success, not a failure.
        const duplicate = /already exists|duplicate/i.test(error.message ?? "");
        contactStored = duplicate;
        if (!duplicate) {
          console.error("quiz-lead: contact create failed", error);
          warnings.push("contact-create-failed");
        }
      } else {
        contactStored = true;
      }
    }

    // 3) Her profile email — now carrying the score she was promised.
    {
      const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Your Peri Score: ${score.display}`,
        html: profileEmailHtml({
          score,
          symptomCount: symptoms.length,
          unsubscribe: unsubscribeUrl(origin, email),
        }),
        // RFC 8058 one-click unsubscribe. Gmail and Apple Mail surface this as a
        // native "Unsubscribe" control, which routes complaints to our endpoint
        // instead of the spam button.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl(origin, email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (error) {
        console.error("quiz-lead: profile email failed", error);
        warnings.push("profile-email-failed");
      }
    }

    // 4) Internal notification — the durable attribution record (Resend
    //    Audience contacts can't store custom fields).
    const answerRows = QUESTIONS.map((q) => {
      const value = q.kind === "multi" ? symptoms.map((s) => labelFor(q.id, s)).join(", ") : answers[q.id] ? labelFor(q.id, answers[q.id]) : "";
      return `<tr><td style="padding:4px 12px 4px 0;color:#6B7070;">${escapeHtml(q.id)}</td><td style="padding:4px 0;color:#1A1C1C;">${value ? escapeHtml(value) : "—"}</td></tr>`;
    }).join("");
    const utmRows = Object.entries(attribution)
      .map(
        ([k, val]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#6B7070;">${escapeHtml(k)}</td><td style="padding:4px 0;color:#1A1C1C;">${escapeHtml(String(val))}</td></tr>`,
      )
      .join("");

    let notified = false;
    {
      const { error } = await resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        subject: `New quiz lead: ${email}${answers.age ? ` (${answers.age})` : ""}`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1A1C1C;">
            <h2 style="margin:0 0 8px;">New quiz lead</h2>
            <p style="margin:0 0 16px;"><strong>${escapeHtml(email)}</strong></p>
            <p style="margin:0 0 16px;color:#6B7070;font-size:14px;">
              Peri Score <strong style="color:#1A1C1C;">${score.display}</strong> · ${escapeHtml(score.label)}
              ${contactStored ? "" : ' · <strong style="color:#B5403B;">NOT added to the audience</strong>'}
            </p>
            <h3 style="margin:16px 0 4px;font-size:14px;color:#00464A;">Answers</h3>
            <table style="border-collapse:collapse;font-size:14px;">${answerRows}</table>
            <h3 style="margin:16px 0 4px;font-size:14px;color:#00464A;">Attribution</h3>
            <table style="border-collapse:collapse;font-size:14px;">${utmRows || '<tr><td style="color:#6B7070;">none</td></tr>'}</table>
          </div>
        `,
      });
      if (error) {
        console.error("quiz-lead: notification email failed", error);
        warnings.push("notification-failed");
      } else {
        notified = true;
      }
    }

    // The lead is only truly lost when it reached neither the list nor the
    // inbox. Reporting success in that case is what let the July drop go
    // unnoticed. Anything less than total failure still returns 200 — she
    // should never lose her results over a mailing-list problem.
    if (!contactStored && !notified) {
      console.error("quiz-lead: LEAD LOST — no audience write and no notification", { warnings });
      return NextResponse.json({ error: "Could not save your email" }, { status: 502 });
    }

    if (warnings.length) console.warn("quiz-lead: completed with warnings", warnings);
    return NextResponse.json({ success: true, warnings });
  } catch (error) {
    console.error("quiz-lead error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
