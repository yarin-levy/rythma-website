import { describe, expect, it } from "vitest";
import * as DATA from "../data";
import * as LANDING from "../landing";
import { ALLOWED, bannedHits, collectStrings } from "../copy-guards";
import {
  buildStartingPicture,
  candidateTest,
  planCardOrder,
  proofRowOrder,
  recognizedHeadline,
  selectAdvertorial,
  selectBridge,
  selectQuoteOrder,
  selectUrgency,
  unknownLines,
  weighingCategories,
  type SpAnswers,
} from "../reveal";

const { CANDIDATE_RULES, CANDIDATE_TESTS, FLOW, QUESTIONS, RECOGNIZED, SYMPTOMS, TOTAL_SCREENS, UNKNOWNS } = DATA;

// ── The map ─────────────────────────────────────────────────────────────────

describe("the flow", () => {
  it("is 31 screens in 6 acts", () => {
    expect(TOTAL_SCREENS).toBe(31);
    expect(new Set(FLOW.map((s) => s.act)).size).toBe(6);
  });

  it("numbers screens 1…31 with no gaps, so the rail can read `07 / 31`", () => {
    expect(FLOW.map((s) => s.n)).toEqual(Array.from({ length: 31 }, (_, i) => i + 1));
  });

  // Blueprint §3's prose says "every act ends on a beat or a video, never on a
  // question", but §3's own map — the numbered list §4 then details screen by
  // screen — ends acts A, B and D on questions 6, 11 and 22. The map is the
  // artifact the rest of the document is written against, so the map wins and
  // the prose is the error. Flagged for Yarin; this test pins the map as given,
  // so a reorder cannot drift without someone deciding to.
  it("splits the acts exactly where the §3 map splits them", () => {
    const boundaries = DATA.ACTS.map((a) => {
      const screens = FLOW.filter((s) => s.act === a.id);
      return [a.id, screens[0].n, screens[screens.length - 1].n];
    });
    expect(boundaries).toEqual([
      ["seen", 1, 6],
      ["changed", 7, 11],
      ["tried", 12, 15],
      ["works", 16, 22],
      ["picture", 23, 27],
      ["begin", 28, 31],
    ]);
  });

  it("keeps 10a out of the count — it is a fork, not a step", () => {
    expect(FLOW.some((s) => s.id === "no_period_reason")).toBe(false);
    expect(DATA.optionIds("no_period_reason")).toHaveLength(5);
  });

  it("has 30 symptom chips, all with distinct app raw values", () => {
    expect(SYMPTOMS).toHaveLength(30);
    expect(new Set(SYMPTOMS.map((s) => s.id)).size).toBe(30);
  });
});

// ── The candidate test (blueprint §5) ───────────────────────────────────────

describe("the first 2-week test candidate", () => {
  it.each(CANDIDATE_RULES.map((r) => [r.test, r] as const))(
    "%s fires for its own input and any one of its symptoms",
    (_test, rule) => {
      for (const s of rule.symptoms) {
        const match = candidateTest({ inputs: [rule.input], symptoms: [s] });
        expect(match.id).toBe(rule.test);
        expect(match.input).toBe(rule.input);
        expect(match.symptom).toBe(s);
        expect(match.note).toBeUndefined();
      }
    },
  );

  it("takes the first matching rule when several could match", () => {
    // Caffeine + alcohol + sleep problems matches rules 1, 2 and 3; rule 1 wins.
    const match = candidateTest({
      inputs: ["screens_past_10pm", "drink_most_evenings", "caffeine_after_2pm"],
      symptoms: ["sleepDisruption"],
    });
    expect(match.id).toBe("caffeine_cutoff");
  });

  it("falls back with its own extra line when an input matches no symptom", () => {
    const match = candidateTest({ inputs: ["caffeine_after_2pm"], symptoms: ["dryEyes"] });
    expect(match.id).toBe("wind_down");
    expect(match.note).toBe(DATA.CANDIDATE_FALLBACK_NOTE);
  });

  it("falls back for “None of these”, which is never treated as an input", () => {
    const match = candidateTest({ inputs: ["none"], symptoms: ["anxiety"] });
    expect(match.id).toBe("wind_down");
    expect(match.note).toBe(DATA.CANDIDATE_FALLBACK_NOTE);
  });

  it("falls back with no answers at all", () => {
    expect(candidateTest({}).id).toBe("wind_down");
  });

  it("high-stress days reach the same test without the fallback line", () => {
    const match = candidateTest({ inputs: ["high_stress"], symptoms: ["rage"] });
    expect(match.id).toBe("wind_down");
    expect(match.note).toBeUndefined();
  });

  it("names every test in the app's catalog and nothing else", () => {
    expect(Object.keys(CANDIDATE_TESTS).sort()).toEqual(
      ["alcohol_free", "caffeine_cutoff", "early_dinner", "morning_walk", "screen_curfew", "wind_down"].sort(),
    );
  });
});

// ── Category weighting (screen 25 row 2) ────────────────────────────────────

describe("weighing on you most", () => {
  it("orders body systems by how many chips she tapped", () => {
    const cats = weighingCategories({
      symptoms: ["brainFog", "anxiety", "rage", "sleepDisruption", "fatigue", "hotFlashes"],
    });
    expect(cats.map((c) => c.id)).toEqual(["mind_mood", "body", "temperature"]);
    expect(cats[0].symptoms.map((s) => s.label)).toEqual(["Brain fog", "Anxiety", "Rage / anger"]);
  });

  it("caps at three categories even when she named five", () => {
    const cats = weighingCategories({
      symptoms: ["hotFlashes", "fatigue", "brainFog", "dryEyes", "lowLibido"],
    });
    expect(cats).toHaveLength(3);
  });

  it("breaks ties on the canonical category order, not on tap order", () => {
    const tapped = weighingCategories({ symptoms: ["brainFog", "hotFlashes"] });
    const reversed = weighingCategories({ symptoms: ["hotFlashes", "brainFog"] });
    expect(tapped.map((c) => c.id)).toEqual(["temperature", "mind_mood"]);
    expect(reversed.map((c) => c.id)).toEqual(tapped.map((c) => c.id));
  });

  it("lists her chips in the app's canonical order inside a category", () => {
    const cats = weighingCategories({ symptoms: ["rage", "anxiety", "brainFog"] });
    expect(cats[0].symptoms.map((s) => s.id)).toEqual(["brainFog", "anxiety", "rage"]);
  });

  it("drops nothing and invents nothing", () => {
    const cats = weighingCategories({ symptoms: ["fatigue", "notARealSymptom"] });
    expect(cats.flatMap((c) => c.symptoms.map((s) => s.id))).toEqual(["fatigue"]);
  });

  it("returns nothing when she named nothing", () => {
    expect(weighingCategories({})).toEqual([]);
  });
});

// ── Count grammar (screens 8 and 25 row 1) ─────────────────────────────────

describe("the recognized count reads as English at 0, 1 and many", () => {
  it("uses the singular sentence for one", () => {
    expect(recognizedHeadline(1)).toBe(RECOGNIZED.headlineOne);
    expect(recognizedHeadline(1)).not.toMatch(/symptoms/);
  });

  it("uses the plural sentence for many", () => {
    expect(recognizedHeadline(7)).toBe("7 of the 7 things you named are recognized perimenopause symptoms.");
  });

  it.each([
    [1, "1 recognized symptom", "of the 1 you named"],
    [2, "2 recognized symptoms", "of the 2 you named"],
    [30, "30 recognized symptoms", "of the 30 you named"],
  ])("the reveal card agrees with itself at N=%i", (n, label, of) => {
    const picture = buildStartingPicture({ symptoms: SYMPTOMS.slice(0, n).map((s) => s.id) });
    expect(picture.count).toBe(n);
    expect(picture.countLabel).toBe(label);
    expect(picture.countOf).toBe(of);
  });

  it("survives N=0 without a broken sentence, though screen 7 prevents it", () => {
    const picture = buildStartingPicture({});
    expect(picture.count).toBe(0);
    expect(picture.countLabel).toBe("0 recognized symptoms");
    expect(picture.countOf).toBe("of the 0 you named");
    expect(picture.categories).toEqual([]);
  });

  it("counts her chips once each, however many times they arrive", () => {
    expect(buildStartingPicture({ symptoms: ["fatigue", "fatigue", "fatigue"] }).count).toBe(1);
  });
});

// ── Row 3 · What tracking alone can't tell you ─────────────────────────────

describe("what tracking alone can't tell you", () => {
  const base: SpAnswers = { inputs: ["caffeine_after_2pm"], symptoms: ["nightSweats"] };

  it("names her own input and symptom when she gave us both", () => {
    const lines = unknownLines(base, candidateTest(base));
    expect(lines[1]).toBe(UNKNOWNS.linked("caffeine after 2pm", "night sweats"));
  });

  it("falls back to the general line when she picked no inputs", () => {
    const answers: SpAnswers = { symptoms: ["fatigue"] };
    expect(unknownLines(answers, candidateTest(answers))[1]).toBe(UNKNOWNS.linkedFallback);
  });

  it("still names a pair when she has inputs but no rule matched", () => {
    const answers: SpAnswers = { inputs: ["caffeine_after_2pm"], symptoms: ["dryEyes"] };
    expect(unknownLines(answers, candidateTest(answers))[1]).toBe(UNKNOWNS.linked("caffeine after 2pm", "dry eyes"));
  });

  it("leads with the doctor line when she felt dismissed", () => {
    const answers: SpAnswers = { ...base, doctor: "feltDismissed" };
    const lines = unknownLines(answers, candidateTest(answers));
    expect(lines[0]).toBe(UNKNOWNS.doctor);
    expect(lines).toHaveLength(3);
  });

  it("keeps the doctor line last otherwise, and always shows all three", () => {
    for (const doctor of ["helpfulDoctor", "notYet", "didntKnow", undefined]) {
      const answers: SpAnswers = { ...base, doctor };
      const lines = unknownLines(answers, candidateTest(answers));
      expect(lines[0]).toBe(UNKNOWNS.days);
      expect(lines[2]).toBe(UNKNOWNS.doctor);
    }
  });
});

// ── Order of the plan cards (26) and the proof stack (29) ─────────────────

describe("plan card order", () => {
  it("leads with what she said matters most", () => {
    expect(planCardOrder({ matters: "understandBody" })[0]).toBe("test");
    expect(planCardOrder({ matters: "feelLessAlone" })[0]).toBe("relief");
  });

  it("puts the hard-day reflection second", () => {
    const order = planCardOrder({ matters: "understandBody", reflection: "right_then" });
    expect(order.slice(0, 2)).toEqual(["test", "relief"]);
  });

  it("does not duplicate a card when 22 and 17 point at the same one", () => {
    const order = planCardOrder({ matters: "doctorEvidence", reflection: "show_doctor" });
    expect(order[0]).toBe("doctor");
    expect(new Set(order).size).toBe(4);
  });

  it("lets `feltDismissed` force Doctor Kit to position 1, over 22", () => {
    const order = planCardOrder({ matters: "hardDayPredictions", doctor: "feltDismissed" });
    expect(order[0]).toBe("doctor");
    expect(new Set(order).size).toBe(4);
  });

  it("always returns all four cards, whatever she answered", () => {
    for (const matters of [undefined, ...Object.keys(DATA.MATTERS_TO_CARD)]) {
      for (const reflection of [undefined, ...Object.keys(DATA.REFLECTION_TO_CARD)]) {
        const order = planCardOrder({ matters, reflection });
        expect(new Set(order).size).toBe(4);
      }
    }
  });

  it("moves proof rows 1–4 with the cards and pins rows 5 and 6", () => {
    const rows = proofRowOrder({ matters: "doctorEvidence" });
    expect(rows[0]).toBe("doctor_kit");
    expect(rows.slice(4)).toEqual(["privacy", "quote"]);
    expect(new Set(rows).size).toBe(6);
  });
});

// ── Cycle suppression (§5) ─────────────────────────────────────────────────

describe("“I don't get periods” silences every cycle sentence downstream", () => {
  it("drops the advertorial's cycle sentences and keeps the rest", () => {
    const withCycle = selectAdvertorial("usingAppDoesntWork", "irregular").join(" ");
    const without = selectAdvertorial("usingAppDoesntWork", "noPeriods").join(" ");
    expect(withCycle).toMatch(/22 days/);
    expect(without).not.toMatch(/22 days/);
    expect(without).not.toMatch(/43 days late/);
    expect(without).toMatch(/Most period apps still assume a regular, fertile cycle\./);
    expect(without).toMatch(/Nothing you could put in front of a doctor\./);
  });

  it("leaves the other two variants untouched, since neither names her cycle", () => {
    for (const tracking of ["notesOrCalendar", "triedGaveUp", "dontKnowWhereToStart"]) {
      expect(selectAdvertorial(tracking, "noPeriods")).toEqual(selectAdvertorial(tracking, "regular"));
    }
  });

  it("gives the tracker moment a periods-free bridge line", () => {
    expect(selectBridge({ moment: "tracker", cycle: "irregular" }).moment).toMatch(/tracker/);
    expect(selectBridge({ moment: "tracker", cycle: "noPeriods" }).moment).toBe(DATA.BRIDGE_MOMENT.is_this_it);
  });

  it("always ends the bridge on the locked hope line", () => {
    expect(selectBridge({}).hope).toBe(DATA.BRIDGE_HOPE);
  });
});

// ── The remaining branch tables ────────────────────────────────────────────

describe("branch tables cover every option", () => {
  it("has an echo for every moment", () => {
    for (const o of (DATA.question("moment") as DATA.SingleQuestion).options) {
      expect(DATA.ECHO_BY_MOMENT[o.id]?.lines.length).toBeGreaterThan(0);
    }
  });

  it("has an advertorial variant for every tracking answer", () => {
    for (const o of (DATA.question("tracking") as DATA.SingleQuestion).options) {
      expect(selectAdvertorial(o.id, "irregular").length).toBeGreaterThan(0);
    }
  });

  it("has a method echo for every doctor answer", () => {
    for (const o of (DATA.question("doctor") as DATA.SingleQuestion).options) {
      expect(DATA.METHOD_ECHO_BY_DOCTOR[o.id]).toBeTruthy();
    }
  });

  it("has a duration line for every “how long”", () => {
    for (const o of (DATA.question("how_long") as DATA.SingleQuestion).options) {
      expect(DATA.BRIDGE_DURATION[o.id]).toBeTruthy();
    }
  });

  it("leads with her moment's quote and keeps all four", () => {
    expect(selectQuoteOrder("tracker")[0]).toBe("rachel");
    expect(selectQuoteOrder("dismissed")[0]).toBe("denise_log");
    expect(selectQuoteOrder("is_this_it")).toEqual(DATA.QUOTES.map((q) => q.id));
    expect(selectQuoteOrder(undefined)).toHaveLength(4);
  });

  it("shows an urgency subline for the two severe answers only", () => {
    expect(selectUrgency("annoying")).toBeUndefined();
    expect(selectUrgency("seriouslyDisrupting")).toBeTruthy();
    expect(selectUrgency("losingControl")).toBeTruthy();
  });
});

// ── The app's enum raw values (app handout §2) ─────────────────────────────

describe("enum raw values are the app's, verbatim", () => {
  it.each([
    [
      "age",
      [
        "underThirtyEight",
        "thirtyEightToFortyTwo",
        "fortyThreeToFortySeven",
        "fortyEightToFiftyTwo",
        "fiftyThreeToFiftyFive",
        "fiftySixPlus",
      ],
    ],
    ["intensity", ["annoying", "seriouslyDisrupting", "losingControl"]],
    ["cycle", ["regular", "irregular", "cantRemember", "stopped", "noPeriods"]],
    ["no_period_reason", ["hysterectomy", "ablationOrIUD", "stopped12Months", "hrtContinuous", "other"]],
    ["doctor", ["helpfulDoctor", "feltDismissed", "notYet", "didntKnow"]],
    ["tracking", ["usingAppDoesntWork", "notesOrCalendar", "triedGaveUp", "dontKnowWhereToStart"]],
    ["matters", ["hardDayPredictions", "understandBody", "doctorEvidence", "feelLessAlone"]],
  ])("%s sends the app's rawValues in the app's order", (id, expected) => {
    expect(DATA.optionIds(id as string)).toEqual(expected);
  });

  it("sends the 30 Symptom rawValues in the app's canonical order", () => {
    expect(DATA.SYMPTOM_IDS).toEqual([
      "hotFlashes",
      "nightSweats",
      "coldFlashes",
      "sleepDisruption",
      "fatigue",
      "jointPain",
      "muscleAches",
      "headaches",
      "bloating",
      "digestiveIssues",
      "acidReflux",
      "breastTenderness",
      "heartPalpitations",
      "weightChanges",
      "dizziness",
      "restlessLegs",
      "urinarySymptoms",
      "brainFog",
      "memoryLapses",
      "anxiety",
      "moodSwings",
      "irritability",
      "rage",
      "itchySkin",
      "dryEyes",
      "burningMouth",
      "tinnitus",
      "hairChanges",
      "lowLibido",
      "vaginalDryness",
    ]);
  });

  it("never sends `barelyNoticeable` — the web has no such option", () => {
    expect(DATA.optionIds("intensity")).not.toContain("barelyNoticeable");
  });
});

// ── The copy guard ─────────────────────────────────────────────────────────

/** Every string the funnel can produce: the tables, the templates, the reveals. */
function everyString(): string[] {
  const strings = [
    ...collectStrings(DATA),
    ...collectStrings(LANDING),
    // The templates, exercised.
    ...[0, 1, 2, 7, 30].flatMap((n) => [recognizedHeadline(n), DATA.REVEAL.countMany(n), DATA.REVEAL.countOf(n)]),
    DATA.PLAN.headline("Sarah"),
    DATA.CHECKOUT.planLine("annual"),
    DATA.CHECKOUT.planLine("monthly"),
  ];

  const moments = (DATA.question("moment") as DATA.SingleQuestion).options.map((o) => o.id);
  const trackings = (DATA.question("tracking") as DATA.SingleQuestion).options.map((o) => o.id);
  const cycles = (DATA.question("cycle") as DATA.SingleQuestion).options.map((o) => o.id);
  const doctors = (DATA.question("doctor") as DATA.SingleQuestion).options.map((o) => o.id);
  const inputs = (DATA.question("inputs") as DATA.MultiQuestion).options.map((o) => o.id);
  const symptomSets = [[], ["fatigue"], DATA.SYMPTOM_IDS.slice(0, 9), [...DATA.SYMPTOM_IDS]];

  for (const moment of moments)
    for (const tracking of trackings)
      for (const cycle of cycles)
        for (const doctor of doctors)
          for (const input of inputs)
            for (const symptoms of symptomSets) {
              const answers: SpAnswers = {
                moment,
                tracking,
                cycle,
                doctor,
                inputs: [input],
                symptoms: [...symptoms],
                how_long: "few_months",
                matters: "doctorEvidence",
                reflection: "right_then",
                intensity: "losingControl",
              };
              strings.push(...collectStrings(buildStartingPicture(answers)));
              strings.push(...selectAdvertorial(tracking, cycle));
              strings.push(...collectStrings(selectBridge(answers)));
            }
  return strings;
}

describe("no funnel string carries a banned substring", () => {
  const strings = everyString();

  it("scans a real number of strings, so a silent empty pass is impossible", () => {
    expect(strings.length).toBeGreaterThan(1000);
  });

  it("finds no hit outside the allowlist", () => {
    const hits = [...new Set(strings)]
      .map((s) => [s, bannedHits(s)] as const)
      .filter(([, h]) => h.length > 0)
      .map(([s, h]) => `${h.join(",")} → ${s}`);
    expect(hits).toEqual([]);
  });

  it("keeps every allowlist entry in use, so it cannot rot into a loophole", () => {
    const seen = new Set(strings.map((s) => s.trim()));
    for (const entry of ALLOWED) expect(seen.has(entry), `unused allowance: ${entry}`).toBe(true);
  });

  it("shows no Peri Score number or band, and no stage label, anywhere", () => {
    const joined = strings.join(" ").toLowerCase();
    for (const forbidden of [
      "early perimenopause",
      "late perimenopause",
      "out of 100",
      "rythma score",
      "calm",
      "steady",
      "noticeable",
      "heavy",
    ]) {
      expect(joined, `web shows "${forbidden}"`).not.toContain(forbidden);
    }
  });

  it("only ever says Peri Score alongside the word locked or opens", () => {
    expect(DATA.LOADER.sub).toMatch(/stays locked/);
    expect(DATA.REVEAL.scoreLock).toMatch(/^Opens in the app/);
  });
});

describe("every question is reachable and every screen has copy", () => {
  it("puts every question in the flow, or makes it the 10a fork", () => {
    const inFlow = new Set(FLOW.map((s) => s.id));
    for (const q of QUESTIONS) {
      expect(inFlow.has(q.id) || q.id === "no_period_reason", `orphan question ${q.id}`).toBe(true);
    }
  });

  it("gives every flow question a prompt and at least two options", () => {
    for (const s of FLOW.filter((s) => s.type === "question")) {
      const q = DATA.question(s.id);
      expect(q.prompt.length).toBeGreaterThan(0);
      if (q.kind !== "chips") expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("gives every video screen a caption and a text alternative", () => {
    for (const s of FLOW.filter((s) => s.type === "video")) {
      const v = DATA.VIDEOS[s.id];
      expect(v, `no video spec for ${s.id}`).toBeTruthy();
      expect(v.caption.length).toBeGreaterThan(0);
      expect(v.alt.length).toBeGreaterThan(0);
    }
  });
});
