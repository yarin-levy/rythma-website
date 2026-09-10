import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CODE_EMAIL, CODE_EMAIL_SUBJECT, codeEmailHtml } from "../code-email";
import { bannedHits } from "../copy-guards";

const html = codeEmailHtml({
  code: "418902",
  openUrl: "https://rythma.co/open?t=TOKEN",
  appStoreUrl: "https://rythma.co/app",
  manageUrl: "https://rythma.co/manage?k=wq_1.sig",
  trialEndsAt: "September 13, 2026",
});

function textColors(source: string): string[] {
  return [...source.matchAll(/(?<!background-)color:(#[0-9A-Fa-f]{6})/g)].map((m) => m[1].toUpperCase());
}

// The same rule the Starting Picture email is held to, for the same reason:
// Gmail on iOS inverts everything, and light text inside a dark block vanishes.
describe("Gmail dark mode cannot swallow the code", () => {
  it("sets the code as dark type on the lime wash, never the other way round", () => {
    const at = html.indexOf(CODE_EMAIL.codeLabel);
    // The wash is on the enclosing cell, so look either side of the label.
    const block = html.slice(at - 400, at + 600);
    expect(block).toContain("background-color:#EAF7CE");
    expect(block).toContain("color:#084734");
    expect(block).not.toContain("color:#FFFFFF");
  });

  it("uses white type only inside a dark fill", () => {
    const whites = textColors(html).filter((c) => c === "#FFFFFF");
    // One per dark button: the Open in Rythma CTA.
    expect(whites).toHaveLength(1);
    const button = html.slice(
      html.indexOf("background-color:#084734"),
      html.indexOf("</a>", html.indexOf("background-color:#084734")),
    );
    expect(button).toContain("color:#FFFFFF");
  });

  it("puts every other colour on a light ground", () => {
    const rest = [...textColors(html)];
    rest.splice(rest.indexOf("#FFFFFF"), 1);
    for (const color of rest) expect(["#084734", "#3E6A5B"], color).toContain(color);
  });

  it("carries no image", () => {
    expect(html).not.toMatch(/<img/i);
  });
});

describe("what it has to say", () => {
  it("shows the six digits, spaced so they are readable", () => {
    expect(html).toContain("4 1 8 9 0 2");
  });

  it("says which email to redeem it with — the app checks that", () => {
    expect(CODE_EMAIL.codeNote).toMatch(/email you used here/);
    expect(html).toContain(CODE_EMAIL.codeNote);
  });

  it("names the trial end when there is one", () => {
    expect(html).toContain("Your trial runs until September 13, 2026.");
  });

  it("says the subscription is active when there is no trial", () => {
    const monthly = codeEmailHtml({
      code: "111111",
      appStoreUrl: "https://rythma.co/app",
      trialEndsAt: null,
    });
    expect(monthly).toContain(CODE_EMAIL.noTrialLine);
    expect(monthly).not.toMatch(/trial runs until/);
  });

  it("links Manage to our signed route, never to a Stripe session", () => {
    expect(html).toContain("https://rythma.co/manage?k=");
    expect(html).not.toContain("billing.stripe.com");
  });

  it("drops the Open in Rythma button when the webhook got no token", () => {
    const noToken = codeEmailHtml({
      code: "111111",
      appStoreUrl: "https://rythma.co/app",
      trialEndsAt: null,
    });
    expect(noToken).not.toContain(CODE_EMAIL.openCta);
    expect(noToken).toContain(CODE_EMAIL.storeCta);
  });

  it("has the blueprint's subject", () => {
    expect(CODE_EMAIL_SUBJECT).toBe("You’re in. Here’s your code");
  });

  it("carries no banned substring in any visible line", () => {
    const visible = html
      .replace(/<[^>]+>/g, "\n")
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

// Build brief rule 5 / blueprint §9. The browser must be incapable of firing a
// purchase event, not merely trusted not to. The Stripe webhook is the only
// thing in the codebase allowed to.
describe("purchase events are server-side only", () => {
  const clientAnalytics = readFileSync(new URL("../analytics.ts", import.meta.url), "utf8");
  /** Comments explain the rule; code must not break it. */
  const code = clientAnalytics.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  it("the client analytics module names no purchase event in its code", () => {
    for (const forbidden of ["Purchase", "StartTrial", "Subscribe"]) {
      expect(code, `client can fire ${forbidden}`).not.toContain(forbidden);
    }
  });

  it("its Meta helper accepts only the three browser-side standard events", () => {
    const union = /type MetaEvent =([^;]+);/.exec(code)?.[1] ?? "";
    expect(union).toContain("ViewContent");
    expect(union).toContain("Lead");
    expect(union).toContain("InitiateCheckout");
    expect(union.split("|")).toHaveLength(3);
  });
});
