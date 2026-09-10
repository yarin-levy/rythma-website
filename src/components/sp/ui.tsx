"use client";

import type { ReactNode } from "react";

// The funnel's components, exactly as blueprint §2 specifies them. Every colour
// and size comes from a `--sp-*` token, so nothing here has a hard-coded value
// the token test can't see.

/**
 * One screen. The document scrolls rather than an inner pane, so iOS Safari's
 * own address-bar behaviour is left alone and the long screens (the reveal, the
 * plan) scroll naturally. The primary action sticks above the home indicator.
 */
export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex min-h-svh flex-col gap-7 px-6 pt-5 pb-4 ${className}`}>{children}</div>;
}

/** Instrument Serif, 40–44px. The emphasized clause is always the last line. */
export function SerifHeadline({
  lines,
  italicLast = true,
  className = "",
}: {
  lines: readonly string[];
  /** The bridge sets this false — there the locked hope line carries the italic. */
  italicLast?: boolean;
  className?: string;
}) {
  return (
    <h2 className={`font-sp-serif text-sp-ink text-[length:var(--sp-text-serif)] leading-[1.1] ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`block ${italicLast && i === lines.length - 1 && lines.length > 1 ? "italic" : ""}`}>
          {line}
        </span>
      ))}
    </h2>
  );
}

/** Archivo 600, 30px. Never the serif — she has to act on this. */
export function Prompt({ children }: { children: ReactNode }) {
  return <h2 className="text-sp-ink text-[length:var(--sp-text-prompt)] leading-[1.2] font-semibold">{children}</h2>;
}

export function Sub({ children }: { children: ReactNode }) {
  return <p className="text-sp-ink2 text-[length:var(--sp-text-body)] leading-[1.5]">{children}</p>;
}

/** 15px minimum, uppercase, tabular. The quietest text the funnel allows. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`text-sp-ink3 text-[length:var(--sp-text-label)] font-semibold tracking-[0.06em] uppercase tabular-nums ${className}`}
    >
      {children}
    </span>
  );
}

/** Solid ink fill, white text, 60px. This reads as "confirm" on a form. */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="sp-tap bg-sp-ink text-sp-page flex min-h-[60px] w-full items-center justify-center rounded-full px-6 text-[length:var(--sp-text-body)] font-semibold transition-opacity active:opacity-90 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/** Text only, underlined, 48px tap height. Skip and back live here. */
export function SecondaryAction({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="sp-tap text-sp-ink flex min-h-[48px] items-center justify-center text-[length:var(--sp-text-chip)] underline"
    >
      {children}
    </button>
  );
}

/** The sticky footer the primary action sits in. */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="sp-actions mt-auto flex flex-col items-center gap-1 pt-3">{children}</div>;
}

export function Footnote({ children }: { children: ReactNode }) {
  return <p className="text-sp-ink2 text-[length:var(--sp-text-label)] leading-[1.5]">{children}</p>;
}

/** Hairline-ruled rows — the method diagram, the privacy rows, the card rows. */
export function RuledRows({
  rows,
  numbered = false,
}: {
  rows: readonly { title?: string; text: string }[];
  numbered?: boolean;
}) {
  return (
    <ol className="border-sp-hair flex flex-col border-t">
      {rows.map((row, i) => (
        <li
          key={i}
          className="border-sp-hair text-sp-ink flex gap-3 border-b py-4 text-[length:var(--sp-text-body)] leading-[1.4]"
        >
          {numbered && (
            <span className="text-sp-ink3 shrink-0 font-semibold tabular-nums" aria-hidden>
              {i + 1}
            </span>
          )}
          <span>
            {row.title && <strong className="font-semibold">{row.title}</strong>}
            {row.title && " "}
            {row.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Blueprint §2: hairline above, 15px ink2. Names the sources, on every screen. */
export function EvidenceFooter({ text }: { text: string }) {
  return (
    <p className="border-sp-hair text-sp-ink2 border-t pt-3 text-[length:var(--sp-text-label)] leading-[1.5]">{text}</p>
  );
}

export function CheckGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden>
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A drawn phone, not a screenshot chrome: 2px ink border, 40px radius, no fake status bar. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border-sp-ink mx-auto w-full max-w-[16rem] overflow-hidden rounded-[40px] border-2">
      <div className="bg-sp-page relative aspect-[9/16] w-full">{children}</div>
    </div>
  );
}
