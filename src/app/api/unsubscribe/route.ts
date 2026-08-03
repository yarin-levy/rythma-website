import { Resend } from "resend";
import { verifyEmail } from "@/lib/unsubscribe";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

/**
 * Opt-out endpoint for the quiz nurture list.
 *
 * GET renders a confirmation with a button; POST performs the removal. That
 * split matters: corporate mail scanners and link previewers fetch every URL in
 * an email, so a GET that unsubscribed directly would silently drop people who
 * never clicked anything. Mail clients doing RFC 8058 one-click unsubscribe
 * send a POST, which lands on the real handler.
 */

function page(title: string, body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title} — Rythma</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:#F9F9F8;color:#1A1C1C;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px}
  .card{max-width:420px;width:100%;background:#fff;border-radius:16px;padding:32px;text-align:center;
    box-shadow:0 4px 6px rgba(0,0,0,.05)}
  h1{margin:0 0 12px;font-size:22px;color:#00464A}
  p{margin:0 0 20px;font-size:15px;line-height:1.6;color:#4b5563}
  button{background:#00464A;color:#fff;border:0;border-radius:9999px;padding:14px 28px;
    font-size:16px;font-weight:600;cursor:pointer}
</style></head><body><div class="card">${body}</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function parse(url: string): { email: string; token: string } {
  const { searchParams } = new URL(url);
  return { email: searchParams.get("e") ?? "", token: searchParams.get("t") ?? "" };
}

export async function GET(request: Request) {
  const { email, token } = parse(request.url);
  if (!verifyEmail(email, token)) {
    return page("Link expired", "<h1>This link isn't valid</h1><p>Reply to any of our emails and we'll take you off the list by hand.</p>", 400);
  }
  const esc = email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return page(
    "Unsubscribe",
    `<h1>Unsubscribe?</h1><p>We'll stop emailing <strong>${esc}</strong>.</p>
     <form method="post"><button type="submit">Yes, unsubscribe me</button></form>`,
  );
}

export async function POST(request: Request) {
  const { email, token } = parse(request.url);
  if (!verifyEmail(email, token)) {
    return page("Link expired", "<h1>This link isn't valid</h1><p>Reply to any of our emails and we'll take you off the list by hand.</p>", 400);
  }

  if (!AUDIENCE_ID) {
    console.error("unsubscribe: RESEND_AUDIENCE_ID is not set — cannot honor opt-out");
    return page("Something went wrong", "<h1>We couldn't do that right now</h1><p>Reply to any of our emails and we'll take you off the list by hand.</p>", 500);
  }

  const { error } = await resend.contacts.update({
    email,
    audienceId: AUDIENCE_ID,
    unsubscribed: true,
  });

  if (error) {
    console.error("unsubscribe: Resend rejected the update", error);
    return page("Something went wrong", "<h1>We couldn't do that right now</h1><p>Reply to any of our emails and we'll take you off the list by hand.</p>", 500);
  }

  return page("Unsubscribed", "<h1>You're unsubscribed</h1><p>You won't hear from us again. Take care of yourself.</p>");
}
