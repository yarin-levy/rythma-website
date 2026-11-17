import { describe, expect, it } from "vitest";
import { parseSurvey } from "../feedback-survey";

const base = { status: "trial_cancelled", mainReason: "price" };

describe("parseSurvey", () => {
  it("accepts a minimal answer", () => {
    const r = parseSurvey(base);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.row).toMatchObject({ status: "trial_cancelled", main_reason: "price", come_back: [], contact_ok: false });
  });

  it("requires status and a known reason", () => {
    expect(parseSurvey({ mainReason: "price" }).ok).toBe(false);
    expect(parseSurvey({ status: "trial_cancelled", mainReason: "drop table" }).ok).toBe(false);
  });

  it("drops unknown multi-select values and duplicates", () => {
    const r = parseSurvey({ ...base, comeBack: ["lower_price", "lower_price", "hack", 3] });
    expect(r.ok && r.row.come_back).toEqual(["lower_price"]);
  });

  it("clips long free text instead of rejecting it", () => {
    const r = parseSurvey({ ...base, hopedFor: "x".repeat(5000) });
    expect(r.ok && (r.row.hoped_for as string).length).toBe(4000);
  });

  it("only keeps the email when she agreed to follow-up", () => {
    const no = parseSurvey({ ...base, contactOk: false, contactEmail: "a@b.co" });
    expect(no.ok && no.row.contact_email).toBe(null);
    const bad = parseSurvey({ ...base, contactOk: true, contactEmail: "nope" });
    expect(bad.ok).toBe(false);
  });

  it("ignores an unknown link group", () => {
    const r = parseSurvey({ ...base, linkGroup: "admin" });
    expect(r.ok && r.row.link_group).toBe(null);
  });
});
