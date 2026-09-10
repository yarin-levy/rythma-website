"use client";

import { useState } from "react";
import { CLARITY_FOOTER, GATE } from "@/lib/sp/data";
import { Actions, Footnote, PrimaryButton, Prompt, Screen, Sub } from "../ui";

// Deliberately loose: this catches a typo, not an invalid address. Real
// validation is the route's job in M2, and a regex that rejects a legitimate
// address costs a completer.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Screen 24. Required (decision §12.3), with the reason line that makes it
 * fair: it is how her Starting Picture reaches the app, so she never answers
 * these questions twice.
 *
 * M1 does not post anything — `onSubmit` just advances. The profile write, the
 * Resend contact and the CAPI Lead land in M2.
 */
export function GateScreen({
  firstName,
  email,
  onChange,
  onSubmit,
  pending,
  error,
}: {
  firstName: string;
  email: string;
  onChange: (patch: { firstName?: string; email?: string }) => void;
  onSubmit: () => void;
  pending?: boolean;
  error?: string;
}) {
  const [touched, setTouched] = useState(false);
  const valid = EMAIL.test(email.trim());

  return (
    <Screen>
      <Prompt>{GATE.headline}</Prompt>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid && !pending) onSubmit();
        }}
      >
        <label className="flex flex-col gap-2">
          <span className="text-sp-ink3 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase">
            {GATE.firstNameLabel}
          </span>
          <input
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="border-sp-hair bg-sp-page text-sp-ink placeholder:text-sp-ink3 min-h-[60px] rounded-2xl border-[1.5px] px-4 text-[length:var(--sp-text-body)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sp-ink3 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase">
            {GATE.emailLabel}
          </span>
          <input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => onChange({ email: e.target.value })}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !valid}
            className="border-sp-hair bg-sp-page text-sp-ink placeholder:text-sp-ink3 min-h-[60px] rounded-2xl border-[1.5px] px-4 text-[length:var(--sp-text-body)]"
          />
        </label>

        <Sub>{GATE.reason}</Sub>

        <Actions>
          <PrimaryButton type="submit" disabled={!valid || pending}>
            {GATE.cta}
          </PrimaryButton>
          {error && <Footnote>{error}</Footnote>}
          <Footnote>{GATE.micro}</Footnote>
          <Footnote>{CLARITY_FOOTER}</Footnote>
        </Actions>
      </form>
    </Screen>
  );
}
