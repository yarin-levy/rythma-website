"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  COME_BACK_OPTIONS,
  LINK_GROUPS,
  REASON_OPTIONS,
  STATUS_FOR_GROUP,
  STATUS_OPTIONS,
  STAY_REASON_OPTIONS,
  type LinkGroup,
  type Option,
} from "@/lib/feedback-survey";

const field =
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Choice({
  option,
  selected,
  multi,
  onSelect,
}: {
  option: Option;
  selected: boolean;
  multi?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base transition-colors ${
        selected
          ? "border-primary bg-raspberry-soft text-ink"
          : "border-border bg-card text-ink hover:border-ink-muted"
      }`}
    >
      <span
        aria-hidden
        className={`flex size-5 shrink-0 items-center justify-center border-2 ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "border-primary bg-primary" : "border-ink-muted"}`}
      >
        {selected && (
          <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M2.5 6.2 5 8.5l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>{option.label}</span>
    </button>
  );
}

function Question({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3">
        <span className="block text-sm font-medium text-ink-soft">Question {n}</span>
        <span className="font-display mt-1 block text-2xl leading-snug text-ink">{title}</span>
        {hint && <span className="mt-1 block text-sm text-ink-soft">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export function FeedbackSurvey() {
  const params = useSearchParams();
  const g = params.get("g");
  const linkGroup: LinkGroup | null = (LINK_GROUPS as readonly string[]).includes(g ?? "")
    ? (g as LinkGroup)
    : null;

  const [status, setStatus] = useState(linkGroup ? STATUS_FOR_GROUP[linkGroup] : "");
  const [mainReason, setMainReason] = useState("");
  const [reasonOther, setReasonOther] = useState("");
  const [hopedFor, setHopedFor] = useState("");
  const [liked, setLiked] = useState("");
  const [comeBack, setComeBack] = useState<string[]>([]);
  const [comeBackOther, setComeBackOther] = useState("");
  const [contactOk, setContactOk] = useState<boolean | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const stillSubscribed = status === "still_subscribed";
  const reasons = stillSubscribed ? STAY_REASON_OPTIONS : REASON_OPTIONS;
  // Question 1 is skipped when the email link already told us the answer.
  const offset = linkGroup ? 0 : 1;

  const canSubmit = useMemo(() => status !== "" && mainReason !== "", [status, mainReason]);

  function pickStatus(v: string) {
    setStatus(v);
    // The reason list changes between "why you left" and "why you stay".
    if ((v === "still_subscribed") !== stillSubscribed) setMainReason("");
  }

  function toggleComeBack(v: string) {
    setComeBack((cur) => {
      if (cur.includes(v)) return cur.filter((x) => x !== v);
      // "Nothing" is exclusive of every other choice.
      if (v === "nothing") return ["nothing"];
      return [...cur.filter((x) => x !== "nothing"), v];
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/feedback-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkGroup,
          status,
          mainReason,
          reasonOther: mainReason === "other" ? reasonOther : "",
          hopedFor,
          liked,
          comeBack,
          comeBackOther: comeBack.includes("other") ? comeBackOther : "",
          contactOk: contactOk === true,
          contactEmail,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-raspberry-soft">
            <svg viewBox="0 0 24 24" className="size-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-3xl leading-tight text-ink">Thank you.</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Every answer is read by the person who builds Rythma. What you told us goes straight into
            what we fix next.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[env(safe-area-inset-top)]">
      <form onSubmit={submit} className="mx-auto max-w-xl space-y-12 px-4 py-10 sm:px-6 sm:py-16">
        <header>
          <p className="text-sm font-semibold tracking-wide text-primary">RYTHMA</p>
          <h1 className="font-display mt-3 text-4xl leading-tight text-ink">Help us make Rythma better</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            You gave Rythma a try, and we&rsquo;d love to know how it went. Six quick questions, about two
            minutes. Honest answers help most, even the hard ones.
          </p>
        </header>

        {!linkGroup && (
          <Question n={1} title="Which best describes you?">
            <div role="radiogroup" className="space-y-2">
              {STATUS_OPTIONS.map((o) => (
                <Choice key={o.value} option={o} selected={status === o.value} onSelect={() => pickStatus(o.value)} />
              ))}
            </div>
          </Question>
        )}

        <Question
          n={1 + offset}
          title={stillSubscribed ? "What keeps you using Rythma?" : "What was the main reason you stopped?"}
          hint="Pick the one that mattered most."
        >
          <div role="radiogroup" className="space-y-2">
            {reasons.map((o) => (
              <Choice key={o.value} option={o} selected={mainReason === o.value} onSelect={() => setMainReason(o.value)} />
            ))}
          </div>
          {mainReason === "other" && (
            <input
              className={field}
              value={reasonOther}
              onChange={(e) => setReasonOther(e.target.value)}
              placeholder="Tell us in a few words"
              maxLength={600}
              aria-label="Other reason"
            />
          )}
        </Question>

        <Question
          n={2 + offset}
          title={
            stillSubscribed
              ? "What do you wish Rythma did that it doesn't yet?"
              : "What did you hope Rythma would do for you that it didn't?"
          }
          hint="This is the answer we learn the most from."
        >
          <textarea
            className={`${field} min-h-32 resize-y`}
            value={hopedFor}
            onChange={(e) => setHopedFor(e.target.value)}
            placeholder="Anything at all"
            maxLength={4000}
            aria-label="What you hoped for"
          />
        </Question>

        <Question n={3 + offset} title="What did you like most, even a little?">
          <textarea
            className={`${field} min-h-28 resize-y`}
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
            placeholder="Optional"
            maxLength={4000}
            aria-label="What you liked"
          />
        </Question>

        <Question
          n={4 + offset}
          title={stillSubscribed ? "What would make Rythma worth more to you?" : "What would make you come back?"}
          hint="Pick as many as you like."
        >
          <div className="space-y-2">
            {COME_BACK_OPTIONS.filter((o) => !(stillSubscribed && o.value === "nothing")).map((o) => (
              <Choice key={o.value} option={o} multi selected={comeBack.includes(o.value)} onSelect={() => toggleComeBack(o.value)} />
            ))}
          </div>
          {comeBack.includes("other") && (
            <input
              className={field}
              value={comeBackOther}
              onChange={(e) => setComeBackOther(e.target.value)}
              placeholder="What would it be?"
              maxLength={600}
              aria-label="Something else"
            />
          )}
        </Question>

        <Question n={5 + offset} title="Can we follow up with you about your answers?">
          <div role="radiogroup" className="space-y-2">
            <Choice option={{ value: "yes", label: "Yes, you can email me" }} selected={contactOk === true} onSelect={() => setContactOk(true)} />
            <Choice option={{ value: "no", label: "No thanks" }} selected={contactOk === false} onSelect={() => setContactOk(false)} />
          </div>
          {contactOk && (
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className={field}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Your email"
              maxLength={320}
              aria-label="Your email"
            />
          )}
        </Question>

        <div className="space-y-3">
          {error && (
            <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-base text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || state === "sending"}
            className="min-h-14 w-full rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {state === "sending" ? "Sending…" : "Send my answers"}
          </button>
          {!canSubmit && (
            <p className="text-center text-sm text-ink-soft">
              Answer {linkGroup ? "the first question" : "the first two questions"} to send.
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
