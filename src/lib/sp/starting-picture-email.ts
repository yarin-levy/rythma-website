// The *Your Starting Picture* email (blueprint §8.2, screen 24).
//
// GMAIL DARK MODE. Gmail on iOS inverts every email and cannot be opted out of.
// What breaks under inversion is LIGHT TEXT INSIDE A DARK BLOCK: the fill can
// survive while the text flips dark, and the text vanishes. Dark text on a light
// ground is safe in both directions. So, exactly as in quiz-lead-email.ts:
//
//   · every text element is dark type on a light ground;
//   · the only dark fill is the CTA button, which mail clients treat as a
//     deliberate colour block;
//   · lime appears as a FILL ONLY — a textless bar — because it is far too
//     light to survive as type.
//
// Table layout, inline styles, no images. Nothing here is a new string: the card
// is screen 25's, built from the same `buildStartingPicture` result the reveal
// renders, so her inbox and her screen cannot disagree.

import { CLARITY_FOOTER, EVIDENCE_FOOTER, REVEAL, SYMPTOMS } from "./data";
import type { StartingPicture } from "./reveal";

const INK = "#084734";
const INK2 = "#3E6A5B";
const LIME = "#CEF17B";
const LIME_WASH = "#EAF7CE";
const HAIR = "#DCE4E0"; // the funnel's hairline, flattened — email has no alpha

export const STARTING_PICTURE_SUBJECT = "Your Starting Picture";

/** Screen 31's button label is the app's; this one is the blueprint's §8.2. */
export const OPEN_IN_RYTHMA = "Open in Rythma";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const SANS = "Arial,Helvetica,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

function label(text: string): string {
  return `<div style="font-family:${SANS};font-size:13px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:1.5px;font-weight:bold;color:${INK2};text-transform:uppercase;">${escapeHtml(text)}</div>`;
}

function row(inner: string, last = false): string {
  const border = last ? "" : `border-bottom:1px solid ${HAIR};`;
  return `<tr><td style="padding:18px 20px;${border}">${inner}</td></tr>`;
}

export function startingPictureEmailHtml(args: {
  picture: StartingPicture;
  firstName?: string;
  /** `https://rythma.co/open?t=<link_token>`. Omitted when there is no token. */
  openUrl?: string;
  unsubscribe: string;
}): string {
  const { picture } = args;
  const name = args.firstName?.trim() || REVEAL.nameFallback;
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const categories = picture.categories
    .map(
      (cat) =>
        `<div style="font-family:${SANS};font-size:16px;line-height:24px;mso-line-height-rule:exactly;color:${INK};padding-top:6px;"><span style="font-family:${SERIF};font-style:italic;">${escapeHtml(cat.label)}:</span> ${escapeHtml(cat.symptoms.map((s) => s.label.toLowerCase()).join(", "))}</div>`,
    )
    .join("");

  const unknowns = picture.unknowns
    .map(
      (line) =>
        `<div style="font-family:${SANS};font-size:16px;line-height:24px;mso-line-height-rule:exactly;color:${INK};padding-top:6px;">${escapeHtml(line)}</div>`,
    )
    .join("");

  const cta = args.openUrl
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-radius:999px;">
      <tr><td align="center" bgcolor="${INK}" style="background-color:${INK};border-radius:999px;">
        <a href="${escapeHtml(args.openUrl)}" style="display:block;padding:19px 24px;font-family:${SANS};font-size:18px;line-height:22px;mso-line-height-rule:exactly;font-weight:bold;color:#FFFFFF;text-decoration:none;">${OPEN_IN_RYTHMA}</a>
      </td></tr>
    </table>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${STARTING_PICTURE_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFFFF;">
<span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">${CLARITY_FOOTER}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;</span>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFFFFF;">
<tr><td align="center" style="padding:24px 16px 40px;">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;">

  <tr><td style="padding-bottom:20px;font-family:${SANS};font-size:14px;line-height:14px;mso-line-height-rule:exactly;letter-spacing:4px;font-weight:bold;color:${INK};">RYTHMA</td></tr>

  <!-- The Starting Picture card: 2px ink border, ruled sections, a lime band
       at the top. Dark type on light fills throughout. -->
  <tr><td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:2px solid ${INK};border-radius:16px;background-color:#FFFFFF;">

      <tr><td bgcolor="${LIME_WASH}" style="background-color:${LIME_WASH};padding:14px 20px;border-bottom:1px solid ${HAIR};">
        <div style="font-family:${SANS};font-size:13px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:1.5px;font-weight:bold;color:${INK};">${REVEAL.cardTitle} &nbsp;·&nbsp; ${escapeHtml(name)} &nbsp;·&nbsp; ${escapeHtml(date)}</div>
      </td></tr>

      ${row(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="bottom" style="font-family:${SERIF};font-size:44px;line-height:44px;mso-line-height-rule:exactly;color:${INK};">${picture.count}</td>
          <td valign="bottom" style="padding-left:12px;">
            <div style="font-family:${SANS};font-size:17px;line-height:22px;mso-line-height-rule:exactly;font-weight:bold;color:${INK};">${escapeHtml(picture.countLabel.replace(/^\d+\s/, ""))}</div>
            <div style="font-family:${SERIF};font-style:italic;font-size:15px;line-height:20px;mso-line-height-rule:exactly;color:${INK2};">${escapeHtml(picture.countOf)}</div>
          </td>
        </tr></table>`)}

      ${picture.categories.length > 0 ? row(label(REVEAL.weighingLabel) + categories) : ""}

      ${row(label(REVEAL.unknownsLabel) + unknowns)}

      ${row(
        label(REVEAL.testLabel) +
          `<div style="font-family:${SANS};font-size:22px;line-height:28px;mso-line-height-rule:exactly;font-weight:bold;color:${INK};padding-top:6px;">${escapeHtml(picture.candidate.label)}</div>` +
          (picture.candidate.note
            ? `<div style="font-family:${SANS};font-size:15px;line-height:22px;mso-line-height-rule:exactly;color:${INK2};padding-top:6px;">${escapeHtml(picture.candidate.note)}</div>`
            : "") +
          `<div style="font-family:${SANS};font-size:14px;line-height:21px;mso-line-height-rule:exactly;color:${INK2};padding-top:8px;">${escapeHtml(REVEAL.testFixedLine)}</div>`,
      )}

      <!-- The locked Peri Score. A textless lime bar stands in for the tile:
           no number, no band, and nothing that has to survive inversion. -->
      ${row(
        label(REVEAL.scoreLabel) +
          `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;margin-top:8px;"><tr><td height="10" bgcolor="${LIME}" style="height:10px;background-color:${LIME};border-radius:999px;font-size:0;line-height:10px;">&nbsp;</td></tr></table>` +
          `<div style="font-family:${SANS};font-size:14px;line-height:21px;mso-line-height-rule:exactly;color:${INK2};padding-top:10px;">${escapeHtml(REVEAL.scoreLock)}</div>`,
        true,
      )}

    </table>
  </td></tr>

  <tr><td style="padding-top:18px;font-family:${SANS};font-size:17px;line-height:24px;mso-line-height-rule:exactly;font-weight:bold;color:${INK};">${CLARITY_FOOTER}</td></tr>

  ${cta ? `<tr><td style="padding-top:22px;">${cta}</td></tr>` : ""}

  <tr><td style="padding-top:24px;border-top:1px solid ${HAIR};margin-top:24px;">
    <div style="font-family:${SANS};font-size:13px;line-height:20px;mso-line-height-rule:exactly;color:${INK2};padding-top:16px;">${EVIDENCE_FOOTER}</div>
    <div style="font-family:${SANS};font-size:12px;line-height:18px;mso-line-height-rule:exactly;color:${INK2};padding-top:12px;"><a href="${escapeHtml(args.unsubscribe)}" style="color:${INK2};text-decoration:underline;">Unsubscribe</a></div>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}

/** The internal notification's answer table needs her labels, not her ids. */
export function symptomLabels(ids: readonly string[]): string[] {
  return ids.map((id) => SYMPTOMS.find((s) => s.id === id)?.label ?? id);
}
