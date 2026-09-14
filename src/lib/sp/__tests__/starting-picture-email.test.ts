import { describe, expect, it } from "vitest";
import { OPEN_IN_RYTHMA, STARTING_PICTURE_SUBJECT, startingPictureEmailHtml } from "../starting-picture-email";
import { buildStartingPicture } from "../reveal";
import { CLARITY_FOOTER, EVIDENCE_FOOTER, REVEAL } from "../data";
import { bannedHits } from "../copy-guards";

const picture = buildStartingPicture({
  moment: "dismissed",
  doctor: "feltDismissed",
  inputs: ["caffeine_after_2pm"],
  symptoms: ["brainFog", "anxiety", "rage", "sleepDisruption", "nightSweats"],
});

const html = startingPictureEmailHtml({
  picture,
  firstName: "Sarah",
  openUrl: "https://rythma.co/open?t=abc123",
  unsubscribe: "https://rythma.co/api/unsubscribe?e=a&t=b",
});

/** Text colours declared anywhere in the document. */
function textColors(source: string): string[] {
  return [...source.matchAll(/(?<!background-)color:(#[0-9A-Fa-f]{6})/g)].map((m) => m[1].toUpperCase());
}

// Gmail on iOS inverts every email and cannot be opted out of. What breaks is
// light text inside a dark block: the fill survives, the text flips dark, the
// text vanishes. This is the rule the repo already learned the hard way, so it
// is asserted rather than remembered.
describe("Gmail dark mode cannot swallow this email", () => {
  it("uses white type exactly once — inside the CTA, which is a deliberate colour block", () => {
    const whites = textColors(html).filter((c) => c === "#FFFFFF");
    expect(whites).toHaveLength(1);
    // And that one sits inside the dark fill, not loose on a light ground.
    const inButton = html.slice(
      html.indexOf("background-color:#084734"),
      html.indexOf("</a>", html.indexOf("background-color:#084734")),
    );
    expect(inButton, "the only white type must be the CTA's own").toContain("color:#FFFFFF");
  });

  it("has exactly one dark fill in the whole document", () => {
    const darkFills = [...html.matchAll(/background-color:#084734/g)];
    expect(darkFills).toHaveLength(1);
  });

  it("puts every other text colour on a light ground", () => {
    // The CTA's single white is the exception asserted above; everything else
    // must be one of the two solid inks.
    const rest = [...textColors(html)];
    rest.splice(rest.indexOf("#FFFFFF"), 1);
    for (const color of rest) {
      expect(["#084734", "#3E6A5B"], `unexpected text colour ${color}`).toContain(color);
    }
  });

  it("uses lime as a fill only, never as type", () => {
    expect(html).toMatch(/background-color:#CEF17B/);
    expect(textColors(html)).not.toContain("#CEF17B");
    expect(textColors(html)).not.toContain("#EAF7CE");
  });

  it("carries no image, so nothing depends on remote loading", () => {
    expect(html).not.toMatch(/<img/i);
  });
});

describe("the card is screen 25's, and hers", () => {
  it("names her and the card", () => {
    expect(html).toContain(REVEAL.cardTitle);
    expect(html).toContain("Sarah");
  });

  it("falls back to the blueprint's placeholder when she skipped her name", () => {
    const anon = startingPictureEmailHtml({ picture, unsubscribe: "u" });
    expect(anon).toContain(REVEAL.nameFallback);
  });

  it("shows her count, her categories and her candidate test", () => {
    expect(html).toContain(String(picture.count));
    expect(html).toContain(picture.candidate.label);
    expect(html).toContain("brain fog, anxiety, rage");
  });

  it("carries every one of her row-3 lines", () => {
    for (const line of picture.unknowns) expect(html).toContain(line);
  });

  it("keeps the fixed lines: the candidate hedge, clarity, the evidence footer", () => {
    expect(html).toContain(REVEAL.testFixedLine);
    expect(html).toContain(CLARITY_FOOTER);
    expect(html).toContain(EVIDENCE_FOOTER);
  });

  it("shows the Peri Score as locked, with no number and no band", () => {
    expect(html).toContain(REVEAL.scoreLock);
    for (const band of ["Calm", "Steady", "Noticeable", "Heavy", "out of 100"]) {
      expect(html, `band leaked: ${band}`).not.toContain(band);
    }
  });
});

describe("the Open in Rythma link", () => {
  it("is the abandoner rescue when a token came back from upsert", () => {
    expect(html).toContain(OPEN_IN_RYTHMA);
    expect(html).toContain("https://rythma.co/open?t=abc123");
  });

  it("is omitted entirely when there is no token yet", () => {
    const noToken = startingPictureEmailHtml({ picture, unsubscribe: "u" });
    expect(noToken).not.toContain(OPEN_IN_RYTHMA);
    expect(noToken).not.toContain("/open?t=");
  });

  it("never puts the token anywhere but the href", () => {
    const visible = html.replace(/<[^>]+>/g, " ");
    expect(visible).not.toContain("abc123");
  });
});

describe("compliance", () => {
  it("has a subject that is the blueprint's", () => {
    expect(STARTING_PICTURE_SUBJECT).toBe("Your Starting Picture");
  });

  it("carries a one-click unsubscribe link", () => {
    expect(html).toContain("https://rythma.co/api/unsubscribe?e=a&amp;t=b");
  });

  it("carries no banned substring in any visible line", () => {
    const visible = html
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, "\n")
      // The preheader pads the clarity line with zero-width entities; decode
      // them so the guard sees the sentence, not the padding.
      .replace(/&nbsp;|&#\d+;|&[a-z]+;/g, " ")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const hits = visible
      .map((line) => [line, bannedHits(line)] as const)
      .filter(([, h]) => h.length > 0)
      .map(([line, h]) => `${h.join(",")} → ${line}`);
    expect(hits).toEqual([]);
  });
});
