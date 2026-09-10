import { createHash } from "node:crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { QUESTIONS, SYMPTOMS, type SingleQuestion } from "@/lib/sp/data";
import { buildStartingPicture, type SpAnswers } from "@/lib/sp/reveal";
import { upsertProfile, usingMock } from "@/lib/sp/profile-api";
import { ProfileApiError, validateUpsert } from "@/lib/sp/profile-contract";
import { STARTING_PICTURE_SUBJECT, startingPictureEmailHtml } from "@/lib/sp/starting-picture-email";
import { unsubscribeUrl } from "@/lib/unsubscribe";

// Screen 24. The old funnel's /api/quiz-lead is left exactly as it is and keeps
// serving the live 14-screen quiz until cutover; this is its own route so the
// two never share a branch.
//
// Order matters. The profile write is the one call that must succeed: it is the
// handoff the whole funnel exists for, and without it she has no rythma_id, so
// M3 has nothing to put in Stripe's client_reference_id. Resend and Meta are
// best-effort around it.

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const NOTIFY_EMAIL = process.env.QUIZ_LEAD_NOTIFY_EMAIL || "hello@rythma.co";
const FROM = "Rythma <hello@rythma.co>";

const META_PIXEL_ID = process.env.META_PIXEL_ID || "862926626501765";
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const META_CAPI_TEST_CODE = process.env.META_CAPI_TEST_EVENT_CODE;

type Payload = {
  /** Present on a resubmit: updates her row instead of creating a second one. */
  rythmaId?: string;
  email?: string;
  firstName?: string;
  /** Dedup key shared with the browser pixel's `Lead`. */
  eventId?: string;
  answers?: SpAnswers;
  symptoms?: string[];
  attribution?: Record<string, string>;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function cookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

/**
 * Server-side `Lead`, hashed, deduped against the browser pixel by event_id.
 * Standard fields only: no custom_data, no answers, nothing health-flavoured
 * (blueprint §9). Best effort — a failure here must never fail the lead.
 */
async function sendCapiLead(args: { email: string; eventId?: string; request: Request }): Promise<void> {
  if (!META_CAPI_TOKEN) return;

  const cookies = args.request.headers.get("cookie");
  const forwardedFor = args.request.headers.get("x-forwarded-for");
  const userAgent = args.request.headers.get("user-agent");

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
          ...(userAgent ? { client_user_agent: userAgent } : {}),
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
    console.error("sp/profile: CAPI rejected the event", res.status, await res.text());
  }
}

/** The internal notification's answer table — her labels, not her ids. */
function answerRows(answers: SpAnswers, symptoms: string[]): string {
  const cell = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#3E6A5B;">${escapeHtml(k)}</td><td style="padding:4px 0;color:#084734;">${v ? escapeHtml(v) : "—"}</td></tr>`;

  const rows = QUESTIONS.filter((q) => q.kind !== "chips").map((q) => {
    const raw = (answers as Record<string, unknown>)[q.id];
    const options = (q as SingleQuestion).options;
    const label = (id: string) => options.find((o) => o.id === id)?.label ?? id;
    const value = Array.isArray(raw) ? raw.map(label).join(", ") : typeof raw === "string" ? label(raw) : "";
    return cell(q.id, value);
  });

  rows.push(cell("symptoms", symptoms.map((id) => SYMPTOMS.find((s) => s.id === id)?.label ?? id).join(", ")));
  return rows.join("");
}

export async function POST(request: Request) {
  try {
    const {
      rythmaId: existingId,
      email,
      firstName,
      eventId,
      answers = {},
      symptoms = [],
      attribution = {},
    } = (await request.json()) as Payload;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Derived here, not trusted from the client, so the candidate test in her
    // inbox can never disagree with the one on her screen — and so a crafted
    // payload cannot put an arbitrary string in the app's profile.
    const picture = buildStartingPicture({ ...answers, symptoms });

    // `symptoms` travels in its own field, so it is kept out of `answers`;
    // every other key rides along, the web-only ones stored as given (§2b).
    const answerFields: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(answers)) {
      if (key === "symptoms" || value === undefined) continue;
      answerFields[key] = value as string | string[];
    }

    const upsertPayload = {
      ...(existingId ? { rythma_id: existingId } : {}),
      email: email.trim(),
      ...(firstName?.trim() ? { first_name: firstName.trim() } : {}),
      answers: answerFields,
      symptoms,
      candidate_test: picture.candidate.id,
      plan_order: [...picture.planOrder],
    };

    // Validate before anything leaves the building. `field` goes to the log,
    // never to her (build brief §2b).
    const problem = validateUpsert(upsertPayload);
    if (problem) {
      console.error("sp/profile: refused an invalid payload", problem);
      return NextResponse.json({ error: "Could not save your Starting Picture" }, { status: 400 });
    }

    // 1) The profile. The only call whose failure fails the request.
    let rythmaId: string;
    let linkToken: string | undefined;
    try {
      const created = await upsertProfile(upsertPayload);
      rythmaId = created.rythma_id;
      linkToken = created.link_token;
      if (usingMock()) {
        console.warn("sp/profile: SP_PROFILE_API_URL is unset — profile written to the mock only");
      }
    } catch (e) {
      const detail = e instanceof ProfileApiError ? { status: e.status, ...e.body } : e;
      console.error("sp/profile: profile write failed", detail);
      return NextResponse.json({ error: "Could not save your Starting Picture" }, { status: 502 });
    }

    const origin = request.headers.get("origin") ?? "https://rythma.co";
    const warnings: string[] = [];

    // 2) Meta CAPI — hashed, deduped against the browser pixel.
    try {
      await sendCapiLead({ email, eventId, request });
    } catch (e) {
      console.error("sp/profile: CAPI send failed", e);
      warnings.push("capi");
    }

    // 3) The Resend audience. Every Resend call returns { data, error } rather
    //    than throwing, so each one is inspected explicitly.
    if (!AUDIENCE_ID) {
      console.error("sp/profile: RESEND_AUDIENCE_ID is not set — she was NOT added to any list");
      warnings.push("audience-not-configured");
    } else {
      const { error } = await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
      if (error && !/already exists|duplicate/i.test(error.message ?? "")) {
        console.error("sp/profile: contact create failed", error);
        warnings.push("contact-create-failed");
      }
    }

    // 4) Her Starting Picture. The *Open in Rythma* link is the abandoner
    //    rescue: before payment it opens the app into a prefilled, quiz-skipped
    //    path that still shows the app's own paywall (build brief §2b). Without
    //    a token there is no button, and the email still stands on its own.
    {
      const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: STARTING_PICTURE_SUBJECT,
        html: startingPictureEmailHtml({
          picture,
          firstName,
          ...(linkToken ? { openUrl: `${origin}/open?t=${encodeURIComponent(linkToken)}` } : {}),
          unsubscribe: unsubscribeUrl(origin, email),
        }),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl(origin, email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (error) {
        console.error("sp/profile: Starting Picture email failed", error);
        warnings.push("picture-email-failed");
      }
    }

    // 5) Internal notification — the durable attribution record.
    {
      const utmRows = Object.entries(attribution)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#3E6A5B;">${escapeHtml(k)}</td><td style="padding:4px 0;color:#084734;">${escapeHtml(String(v))}</td></tr>`,
        )
        .join("");
      const { error } = await resend.emails.send({
        from: FROM,
        to: NOTIFY_EMAIL,
        subject: `Starting Picture: ${email}${answers.age ? ` (${answers.age})` : ""}`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#084734;">
            <h2 style="margin:0 0 8px;">New Starting Picture</h2>
            <p style="margin:0 0 4px;"><strong>${escapeHtml(email)}</strong></p>
            <p style="margin:0 0 16px;color:#3E6A5B;font-size:14px;">
              ${escapeHtml(rythmaId)} ·
              ${picture.count} recognized · ${escapeHtml(picture.candidate.label)}
              ${usingMock() ? " · <strong>MOCK PROFILE STORE</strong>" : ""}
            </p>
            <h3 style="margin:16px 0 4px;font-size:14px;">Answers</h3>
            <table style="border-collapse:collapse;font-size:14px;">${answerRows(answers, symptoms)}</table>
            <h3 style="margin:16px 0 4px;font-size:14px;">Attribution</h3>
            <table style="border-collapse:collapse;font-size:14px;">${utmRows || '<tr><td style="color:#3E6A5B;">none</td></tr>'}</table>
          </div>
        `,
      });
      if (error) {
        console.error("sp/profile: notification email failed", error);
        warnings.push("notification-failed");
      }
    }

    if (warnings.length) console.warn("sp/profile: completed with warnings", warnings);
    // `rythma_id` goes back because M3's checkout needs it as Stripe's
    // client_reference_id. The link token never does — it is a credential that
    // belongs only in her inbox.
    return NextResponse.json({ rythmaId, warnings });
  } catch (error) {
    console.error("sp/profile error:", error);
    return NextResponse.json({ error: "Could not save your Starting Picture" }, { status: 500 });
  }
}
