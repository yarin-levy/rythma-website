import { APP_STORE_URL } from "./quiz-data";
import type { Band, ScoreResult } from "./quiz-score";

/**
 * The quiz results email — "inversion-safe" (variant E).
 *
 * Gmail's dark mode inverts every email and cannot be opted out of; three test
 * sends established that, across a cream design, a colour-pinned one and a
 * fully dark one. What actually breaks under inversion is LIGHT TEXT INSIDE A
 * DARK BLOCK: the fill can survive while the text flips dark, and it vanishes.
 * Dark text on a light fill is safe in both directions.
 *
 * So every text element here is dark type on a light ground. The only dark
 * fills in the whole email are the two CTA buttons, which mail clients treat as
 * deliberate colour blocks. Lime appears as a fill only — under dark type, or
 * as a textless bar or dot — because it is too light to survive as type.
 *
 * Table layout, inline styles, and no images anywhere.
 *
 * INTERIM. This variant is safe everywhere but plainer than the cream "poster"
 * design (variant B), which is the one that actually looks like Rythma. It is
 * in place because no CSS-only approach survives Gmail. The known permanent fix
 * is to render the score block as a PNG from a Next route — images are never
 * inverted — with the teal cell + styled alt text behind it as the blocked-image
 * fallback. Variants B (cream) and D (dark) are in ~/Downloads/Rythma and drop
 * straight into this file; the wiring below is identical for all three.
 */

const LIME = "#DFF264";

/** Meter segments. The active one is filled and drives the band chip above it. */
const SCALE: { band: Band; label: string; width: string }[] = [
  { band: "early", label: "EARLY SHIFT", width: "30%" },
  { band: "moderate", label: "BUILDING", width: "30%" },
  { band: "significant", label: "SIGNIFICANT SHIFT", width: "40%" },
];

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function validationLine(symptomCount: number): string {
  if (symptomCount === 0)
    return "Everything you described fits a season millions of women move through, and almost nobody is prepared for.";
  if (symptomCount === 1)
    return "The one symptom you described is a recognized sign of perimenopause.";
  return `${symptomCount} of the ${symptomCount} symptoms you described are recognized signs of perimenopause.`;
}

/** Three-segment meter — the filled segment follows her band. */
function scaleRows(band: Band): string {
  const bars = SCALE.map((s, i) => {
    const active = s.band === band;
    const gap =
      i < SCALE.length - 1
        ? `<td width="4" style="width:4px;font-size:0;line-height:10px;">&nbsp;</td>`
        : "";
    return `<td width="${s.width}" height="10" style="width:${s.width};height:10px;background-color:${active ? LIME : "#C9C3AE"};font-size:0;line-height:10px;">&nbsp;</td>${gap}`;
  }).join("");

  const labels = SCALE.map((s, i) => {
    const active = s.band === band;
    const span = i < SCALE.length - 1 ? ' colspan="2"' : "";
    return `<td${span} style="padding-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:1px;${active ? "font-weight:bold;color:#00464A;" : "color:#8A9490;"}">${s.label}</td>`;
  }).join("");

  return `<tr>${bars}</tr><tr>${labels}</tr>`;
}

export function profileEmailHtml({
  score,
  symptomCount,
  unsubscribe,
}: {
  score: ScoreResult;
  symptomCount: number;
  /** Per-recipient signed URL — never a generic /unsubscribe page. */
  unsubscribe: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Your Peri Score: ${score.display}</title>
<!--[if mso]>
<style>body,table,td,a{font-family:Arial,Helvetica,sans-serif !important;}</style>
<![endif]-->
<style>
  .wrap{width:100% !important;max-width:600px !important;}
  @media only screen and (max-width:620px){
    .px{padding-left:24px !important;padding-right:24px !important;}
    .pxi{padding-left:24px !important;padding-right:24px !important;}
    .score{font-size:104px !important;line-height:100px !important;}
    .h1{font-size:26px !important;line-height:36px !important;}
    .cta{font-size:18px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#F3EFE2;">
<span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;">What that number means, and what happens next.&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;</span>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3EFE2;">
<tr><td align="center" style="padding:20px 8px 40px 8px;">

<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td width="600" style="width:600px;"><![endif]-->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;background-color:#FFFFFF;">

  <!-- 2 · Header -->
  <tr><td class="px" style="padding:26px 40px 26px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="left">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <!-- live-text app icon; swap for a hosted 40px PNG (alt="Rythma app icon") if you prefer -->
            <td width="40" height="40" align="center" valign="middle" bgcolor="#DFF264" style="width:40px;height:40px;background-color:#DFF264;border-radius:11px;font-family:Arial Black,Arial,Helvetica,sans-serif;font-weight:bold;font-size:21px;line-height:40px;mso-line-height-rule:exactly;color:#00464A;">R</td>
            <td style="padding-left:14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:15px;mso-line-height-rule:exactly;letter-spacing:5px;color:#17191A;font-weight:bold;">RYTHMA</td>
          </tr></table>
        </td>
        <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:14px;mso-line-height-rule:exactly;letter-spacing:2px;color:#8A9490;">IPHONE APP</td>
      </tr>
    </table>
  </td></tr>

  <!-- 3 · Score block — the hero, unfilled -->
  <tr><td class="px" style="padding:8px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:2px solid #17191A;">
      <tr><td style="padding:26px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:5px;font-weight:bold;color:#00464A;">YOUR PERI SCORE</td></tr>
      <tr><td style="padding:6px 0 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="bottom" class="score" style="font-family:Arial Black,Arial,Helvetica,sans-serif;font-weight:bold;font-size:132px;line-height:126px;mso-line-height-rule:exactly;letter-spacing:-6px;color:#00464A;">${score.display}</td>
            <td valign="bottom" style="padding:0 0 22px 16px;font-family:Arial,Helvetica,sans-serif;font-size:20px;line-height:22px;mso-line-height-rule:exactly;letter-spacing:1px;color:#8A9490;">/ 100</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:14px 0 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td bgcolor="#DFF264" style="background-color:#DFF264;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#00464A;white-space:nowrap;">${escapeHtml(score.label.toUpperCase())}</td>
        </tr></table>
      </td></tr>
      <!-- meter: rules on cream, no filled dark blocks -->
      <tr><td style="padding:30px 0 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${scaleRows(score.band)}
        </table>
      </td></tr>
      <tr><td style="padding:28px 0 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #C9C3AE;">
          <tr><td style="padding-top:20px;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:28px;mso-line-height-rule:exactly;color:#00464A;">This is your starting point. It’s meant to move.</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- 4 · Validation line -->
  <tr><td class="px" style="padding:44px 40px 0 40px;">
    <div class="h1" style="font-family:Arial Black,Arial,Helvetica,sans-serif;font-weight:bold;font-size:29px;line-height:40px;mso-line-height-rule:exactly;letter-spacing:-0.4px;color:#17191A;">${escapeHtml(validationLine(symptomCount))}</div>
  </td></tr>

  <!-- 5 · Primary CTA -->
  <tr><td class="px" align="center" style="padding:30px 40px 0 40px;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:28px;mso-line-height-rule:exactly;color:#4A5654;padding-bottom:20px;">Your full score takes about 2 minutes to unlock.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td align="center" bgcolor="#00464A" style="background-color:#00464A;">
        <a href="${APP_STORE_URL}" class="cta" style="display:block;padding:19px 24px;font-family:Arial,Helvetica,sans-serif;font-size:19px;line-height:22px;mso-line-height-rule:exactly;font-weight:bold;letter-spacing:0.3px;color:#FFFFFF;text-decoration:none;">Continue in the Rythma app</a>
      </td></tr>
    </table>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:1px;color:#8A9490;padding-top:16px;">Free on the App Store &nbsp;·&nbsp; iPhone</div>
  </td></tr>

  <!-- 6 · Why now -->
  <tr><td class="px" style="padding:46px 40px 0 40px;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:5px;font-weight:bold;color:#00464A;padding-bottom:14px;">IN THE APP</div>
    <div style="font-family:Arial Black,Arial,Helvetica,sans-serif;font-weight:bold;font-size:26px;line-height:32px;mso-line-height-rule:exactly;letter-spacing:-0.4px;color:#17191A;padding-bottom:26px;">What starts when you do</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <!-- DAY 1 -->
      <tr>
        <td valign="top" width="32" style="width:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td width="16" height="16" bgcolor="#DFF264" style="width:16px;height:16px;background-color:#DFF264;border:2px solid #DFF264;border-radius:16px;font-size:0;line-height:16px;">&nbsp;</td></tr>
            <tr><td align="center" style="padding:6px 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="2" height="56" bgcolor="#C9C3AE" style="width:2px;height:56px;background-color:#C9C3AE;font-size:0;line-height:56px;">&nbsp;</td></tr></table>
            </td></tr>
          </table>
        </td>
        <td valign="top" style="padding:0 0 12px 18px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#00464A;white-space:nowrap;">DAY 1</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;mso-line-height-rule:exactly;color:#4A5654;padding-top:4px;">Your full score, from a 2-minute check-in</div>
        </td>
      </tr>
      <!-- WEEK 1 -->
      <tr>
        <td valign="top" width="32" style="width:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td width="16" height="16" bgcolor="#FFFFFF" style="width:16px;height:16px;background-color:#FFFFFF;border:2px solid #C9C3AE;border-radius:16px;font-size:0;line-height:16px;">&nbsp;</td></tr>
            <tr><td align="center" style="padding:6px 0 0 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="2" height="56" bgcolor="#C9C3AE" style="width:2px;height:56px;background-color:#C9C3AE;font-size:0;line-height:56px;">&nbsp;</td></tr></table>
            </td></tr>
          </table>
        </td>
        <td valign="top" style="padding:0 0 12px 18px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#00464A;white-space:nowrap;">WEEK 1</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;mso-line-height-rule:exactly;color:#4A5654;padding-top:4px;">Your first forecast</div>
        </td>
      </tr>
      <!-- WEEK 2–3 -->
      <tr>
        <td valign="top" width="32" style="width:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td width="16" height="16" bgcolor="#FFFFFF" style="width:16px;height:16px;background-color:#FFFFFF;border:2px solid #C9C3AE;border-radius:16px;font-size:0;line-height:16px;">&nbsp;</td></tr>
          </table>
        </td>
        <td valign="top" style="padding:0 0 0 18px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#00464A;white-space:nowrap;">WEEK 2–3</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;mso-line-height-rule:exactly;color:#4A5654;padding-top:4px;">Your patterns start showing</div>
        </td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:34px;">
      <tr><td style="border-top:2px solid #17191A;padding-top:26px;font-family:Arial Black,Arial,Helvetica,sans-serif;font-weight:bold;font-size:27px;line-height:38px;mso-line-height-rule:exactly;letter-spacing:-0.4px;color:#17191A;">Rythma can’t learn a month you didn’t track.</td></tr>
    </table>
  </td></tr>

  <!-- 7 · Proof -->
  <tr><td class="px" style="padding:44px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#DFF264" style="background-color:#DFF264;">
      <tr><td class="pxi" style="padding:30px 34px 30px 34px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#00464A;">★★★★★ &nbsp;4.9 &nbsp;<span style="font-weight:normal;letter-spacing:1px;color:#3F5A43;">App Store</span></div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:32px;mso-line-height-rule:exactly;color:#17191A;padding-top:14px;">“Rythma finally made me feel like what I’m going through is real and trackable.”</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:2px;font-weight:bold;color:#3F5A43;padding-top:14px;">LAUREN, 45</div>
      </td></tr>
    </table>
  </td></tr>

  <!-- 8 · Closing CTA -->
  <tr><td class="px" align="center" style="padding:36px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td align="center" bgcolor="#00464A" style="background-color:#00464A;">
        <a href="${APP_STORE_URL}" class="cta" style="display:block;padding:19px 24px;font-family:Arial,Helvetica,sans-serif;font-size:19px;line-height:22px;mso-line-height-rule:exactly;font-weight:bold;letter-spacing:0.3px;color:#FFFFFF;text-decoration:none;">Continue in the Rythma app</a>
      </td></tr>
    </table>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:1px;color:#8A9490;padding-top:16px;">Free on the App Store &nbsp;·&nbsp; iPhone</div>
  </td></tr>

  <!-- 10 · P.S. -->
  <tr><td class="px" style="padding:38px 40px 0 40px;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:30px;mso-line-height-rule:exactly;color:#17191A;">
      <strong style="font-family:Arial,Helvetica,sans-serif;font-size:15px;letter-spacing:1px;">P.S.</strong> Your score is a starting point, not a verdict. The number moves.
    </div>
  </td></tr>

  <!-- 9 · Footer -->
  <tr><td class="px" style="padding:34px 40px 40px 40px;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;mso-line-height-rule:exactly;color:#8A9490;">
      You’re getting this because you took the Peri Score quiz at rythma.co.<br>
      <a href="${unsubscribe}" style="color:#8A9490;text-decoration:underline;">Unsubscribe</a><br>
      Rythma, 1102 Ocean Ave, Santa Monica, CA 90403
    </div>
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
