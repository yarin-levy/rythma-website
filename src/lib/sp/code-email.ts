// The *You're in. Here's your code* email (blueprint §8.2, after screen 30).
//
// Same Gmail dark-mode rules as the Starting Picture email, and asserted the
// same way: dark type on light grounds, one dark fill (the CTA), lime as a fill
// only, no images. See starting-picture-email.ts for why.
//
// This is the deferred deep link. Apple offers no other: nothing can carry her
// purchase into an app she has not installed yet, so the code and the link are
// what close the loop.

import { EVIDENCE_FOOTER } from "./data";

const INK = "#084734";
const INK2 = "#3E6A5B";
const LIME_WASH = "#EAF7CE";
const HAIR = "#DCE4E0";

const SANS = "Arial,Helvetica,sans-serif";

export const CODE_EMAIL_SUBJECT = "You’re in. Here’s your code";

/**
 * NEW STRINGS (for Yarin). Blueprint §8.2 names this email's subject and its
 * contents — "the 6-digit code, the App Store link, the receipt line with trial
 * end date, the cancel link" — but does not write the sentences. These are in
 * its voice and clean through the banned list.
 */
export const CODE_EMAIL = {
  heading: "You’re in.",
  /** Mirrors screen 31's step 2 so the email and the screen say one thing. */
  lead: "Put Rythma on your phone, open it, and tap I already joined on the web.",
  codeLabel: "YOUR CODE",
  codeNote: "Six digits, good for 24 hours. Enter it with the email you used here.",
  openCta: "Open in Rythma",
  storeCta: "Get Rythma on the App Store",
  manageLabel: "Manage or cancel",
  trialLine: (endsAt: string) => `Your trial runs until ${endsAt}.`,
  noTrialLine: "Your subscription is active.",
  support: "Questions: support@rythma.co",
} as const;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
    <tr><td align="center" bgcolor="${INK}" style="background-color:${INK};border-radius:999px;">
      <a href="${escapeHtml(href)}" style="display:block;padding:19px 24px;font-family:${SANS};font-size:18px;line-height:22px;mso-line-height-rule:exactly;font-weight:bold;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
    </td></tr></table>`;
}

export function codeEmailHtml(args: {
  code: string;
  /** `https://rythma.co/open?t=<link_token>`, when the webhook got one back. */
  openUrl?: string;
  appStoreUrl: string;
  /** The signed `/manage?k=` link, not a Stripe portal session. */
  manageUrl?: string;
  /** Formatted for reading, e.g. "September 13, 2026". Null on monthly. */
  trialEndsAt: string | null;
}): string {
  const spacedCode = args.code.split("").join(" ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${CODE_EMAIL_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFFFF;">
<span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${CODE_EMAIL.lead}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;</span>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFFFFF;">
<tr><td align="center" style="padding:24px 16px 40px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;">

  <tr><td style="padding-bottom:20px;font-family:${SANS};font-size:14px;line-height:14px;mso-line-height-rule:exactly;letter-spacing:4px;font-weight:bold;color:${INK};">RYTHMA</td></tr>

  <tr><td style="font-family:${SANS};font-size:28px;line-height:34px;mso-line-height-rule:exactly;font-weight:bold;color:${INK};">${CODE_EMAIL.heading}</td></tr>
  <tr><td style="padding-top:10px;font-family:${SANS};font-size:17px;line-height:26px;mso-line-height-rule:exactly;color:${INK};">${CODE_EMAIL.lead}</td></tr>

  <!-- The code: dark tabular type on the lime wash, so inversion cannot eat it. -->
  <tr><td style="padding-top:22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:2px solid ${INK};border-radius:16px;">
      <tr><td bgcolor="${LIME_WASH}" align="center" style="background-color:${LIME_WASH};padding:22px 16px;">
        <div style="font-family:${SANS};font-size:13px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:1.5px;font-weight:bold;color:${INK2};">${CODE_EMAIL.codeLabel}</div>
        <div style="padding-top:10px;font-family:${SANS};font-size:38px;line-height:44px;mso-line-height-rule:exactly;letter-spacing:8px;font-weight:bold;color:${INK};">${escapeHtml(spacedCode)}</div>
      </td></tr>
    </table>
    <div style="padding-top:10px;font-family:${SANS};font-size:14px;line-height:21px;mso-line-height-rule:exactly;color:${INK2};">${CODE_EMAIL.codeNote}</div>
  </td></tr>

  ${args.openUrl ? `<tr><td style="padding-top:22px;">${button(args.openUrl, CODE_EMAIL.openCta)}</td></tr>` : ""}
  <tr><td style="padding-top:12px;font-family:${SANS};font-size:15px;line-height:22px;mso-line-height-rule:exactly;"><a href="${escapeHtml(args.appStoreUrl)}" style="color:${INK};text-decoration:underline;">${CODE_EMAIL.storeCta}</a></td></tr>

  <tr><td style="padding-top:26px;border-top:1px solid ${HAIR};">
    <div style="padding-top:16px;font-family:${SANS};font-size:15px;line-height:22px;mso-line-height-rule:exactly;color:${INK};">${args.trialEndsAt ? escapeHtml(CODE_EMAIL.trialLine(args.trialEndsAt)) : CODE_EMAIL.noTrialLine}</div>
    ${args.manageUrl ? `<div style="padding-top:8px;font-family:${SANS};font-size:15px;line-height:22px;mso-line-height-rule:exactly;"><a href="${escapeHtml(args.manageUrl)}" style="color:${INK};text-decoration:underline;">${CODE_EMAIL.manageLabel}</a></div>` : ""}
    <div style="padding-top:8px;font-family:${SANS};font-size:14px;line-height:21px;mso-line-height-rule:exactly;color:${INK2};">${CODE_EMAIL.support}</div>
    <div style="padding-top:14px;font-family:${SANS};font-size:13px;line-height:20px;mso-line-height-rule:exactly;color:${INK2};">${EVIDENCE_FOOTER}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
