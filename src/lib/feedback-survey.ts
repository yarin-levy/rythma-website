// Questions + validation for rythma.co/feedback, shared by the page and the API
// route so the server accepts exactly the options the page shows.

export type Option = { value: string; label: string };

export const STATUS_OPTIONS: Option[] = [
  { value: "trial_cancelled", label: "I tried the free trial and cancelled before paying" },
  { value: "paid_cancelled", label: "I paid for Rythma, then cancelled" },
  { value: "still_subscribed", label: "I'm still subscribed" },
];

export const REASON_OPTIONS: Option[] = [
  { value: "price", label: "It cost too much" },
  { value: "no_value_yet", label: "I didn't see enough value yet" },
  { value: "forgot", label: "I forgot to use it" },
  { value: "not_my_symptoms", label: "It didn't understand my symptoms" },
  { value: "predictions_off", label: "The predictions weren't accurate" },
  { value: "logging_effort", label: "Logging every day was too much effort" },
  { value: "other_app", label: "I found another app" },
  { value: "bug", label: "A bug or technical problem" },
  { value: "accidental_trial", label: "I didn't mean to start a trial" },
  { value: "other", label: "Something else" },
];

/** Shown instead of REASON_OPTIONS to people who are still subscribed. */
export const STAY_REASON_OPTIONS: Option[] = [
  { value: "stay_predictions", label: "Knowing my hard days ahead of time" },
  { value: "stay_patterns", label: "Seeing my patterns and triggers" },
  { value: "stay_doctor", label: "Getting ready for doctor visits" },
  { value: "stay_tracking", label: "Having everything in one place" },
  { value: "other", label: "Something else" },
];

export const COME_BACK_OPTIONS: Option[] = [
  { value: "lower_price", label: "A lower price" },
  { value: "monthly_plan", label: "A monthly plan" },
  { value: "longer_trial", label: "A longer free trial" },
  { value: "better_predictions", label: "Better predictions" },
  { value: "less_logging", label: "Less daily logging" },
  { value: "doctor_tools", label: "More help with doctor visits" },
  { value: "nothing", label: "Nothing — it's just not for me" },
  { value: "other", label: "Something else" },
];

export const LINK_GROUPS = ["trial", "paid", "active"] as const;
export type LinkGroup = (typeof LINK_GROUPS)[number];

/** The email link's ?g= maps to a pre-answered first question. */
export const STATUS_FOR_GROUP: Record<LinkGroup, string> = {
  trial: "trial_cancelled",
  paid: "paid_cancelled",
  active: "still_subscribed",
};

export type SurveyAnswers = {
  linkGroup: LinkGroup | null;
  status: string;
  mainReason: string;
  reasonOther: string;
  hopedFor: string;
  liked: string;
  comeBack: string[];
  comeBackOther: string;
  contactOk: boolean;
  contactEmail: string;
};

const values = (opts: Option[]) => new Set(opts.map((o) => o.value));
const STATUS = values(STATUS_OPTIONS);
const REASONS = new Set([...values(REASON_OPTIONS), ...values(STAY_REASON_OPTIONS)]);
const COME_BACK = values(COME_BACK_OPTIONS);

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Validate an untrusted payload. Returns the row to insert, or an error message.
 * Free text is clipped to the table's limits rather than rejected, so a long
 * answer is never lost to a 400.
 */
export function parseSurvey(
  input: unknown,
): { ok: true; row: Record<string, unknown> } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid body" };
  const a = input as Partial<Record<keyof SurveyAnswers, unknown>>;

  const status = typeof a.status === "string" && STATUS.has(a.status) ? a.status : null;
  if (!status) return { ok: false, error: "Please tell us which describes you." };

  const mainReason =
    typeof a.mainReason === "string" && REASONS.has(a.mainReason) ? a.mainReason : null;
  if (!mainReason) return { ok: false, error: "Please pick a main reason." };

  const comeBack = Array.isArray(a.comeBack)
    ? [...new Set(a.comeBack.filter((v): v is string => typeof v === "string" && COME_BACK.has(v)))]
    : [];

  const linkGroup =
    typeof a.linkGroup === "string" && (LINK_GROUPS as readonly string[]).includes(a.linkGroup)
      ? a.linkGroup
      : null;

  const contactOk = a.contactOk === true;
  const contactEmail = contactOk ? clip(a.contactEmail, 320) : "";
  if (contactOk && contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, error: "That email doesn't look right." };
  }

  return {
    ok: true,
    row: {
      link_group: linkGroup,
      status,
      main_reason: mainReason,
      reason_other: clip(a.reasonOther, 600) || null,
      hoped_for: clip(a.hopedFor, 4000) || null,
      liked: clip(a.liked, 4000) || null,
      come_back: comeBack,
      come_back_other: clip(a.comeBackOther, 600) || null,
      contact_ok: contactOk,
      contact_email: contactEmail || null,
    },
  };
}

export function labelOf(opts: Option[], value: string): string {
  return opts.find((o) => o.value === value)?.label ?? value;
}
