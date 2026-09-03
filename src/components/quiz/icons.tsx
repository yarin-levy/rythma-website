// Inline SVG icons for the symptom grid and the results promise cards.
// Line-art versions of the SF Symbols the iOS app uses for the same concepts,
// so the quiz grid and the app's onboarding grid read as one product.
// Inline (not sprites/images) so they cost no extra request on a paid lander.

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Keyed by the option values in QUESTIONS[symptoms] and the promise icon keys. */
export const QuizIcon: Record<string, (p: Props) => React.JSX.Element> = {
  // ── symptoms ──
  "hot-flashes": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M12 3s4.5 3.6 4.5 8a4.5 4.5 0 0 1-9 0c0-1.6.7-2.9 1.4-3.8.3 1.2 1 1.9 1.8 2 .4-2.6-.5-4.4 1.3-6.2Z" />
      <path d="M12 21v-2M8 20l-.6-1.7M16 20l.6-1.7" />
    </svg>
  ),
  "night-sweats": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M20 14.5A7.5 7.5 0 0 1 10 4.7a7.5 7.5 0 1 0 10 9.8Z" />
      <path d="M6.5 19.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5S5 16.5 5 16.5s1.5 2.2 1.5 3Z" />
    </svg>
  ),
  "brain-fog": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M6.5 11a4 4 0 1 1 1.2-7.8A3.5 3.5 0 0 1 14 3.6 3.5 3.5 0 0 1 19 7a3.5 3.5 0 0 1-2 3.2" />
      <path d="M4 15h16M6 18.5h12M8 22h8" />
    </svg>
  ),
  anxiety: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M21 12a8 8 0 1 1-3.1-6.3" />
      <path d="M12 8v4.5M12 16h.01" />
      <path d="M21 4v4h-4" />
    </svg>
  ),
  "mood-swings": ({ className }) => (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5h.01M15 9.5h.01" />
      <path d="M8.5 16c1-1.2 2.1-1.8 3.5-1.8s2.5.6 3.5 1.8" />
    </svg>
  ),
  "sleep-problems": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h11a3 3 0 0 1 3 3v5" />
      <path d="M3 14h18M3 18h18M6.5 10V7.5h5V10" />
    </svg>
  ),
  fatigue: ({ className }) => (
    <svg {...base} className={className}>
      <rect x="2" y="8" width="16" height="9" rx="2.5" />
      <path d="M21 11.5v2" />
      <path d="M5 11.5v2" />
    </svg>
  ),
  "weight-changes": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M4.5 20 6.8 8.2A1.5 1.5 0 0 1 8.3 7h7.4a1.5 1.5 0 0 1 1.5 1.2L19.5 20Z" />
      <circle cx="12" cy="5" r="2" />
      <path d="M9.5 12.5h5" />
    </svg>
  ),
  "joint-pain": ({ className }) => (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V4.5M12 15v4.5M9 12H4.5M15 12h4.5" />
    </svg>
  ),
  headaches: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M15.5 21v-3.2c2-1.1 3.3-3.2 3.3-5.6A6.8 6.8 0 0 0 5.4 11l-1.3 3.1h2.2V17c0 1.1.9 2 2 2h1.2v2" />
      <path d="M13 6.5 11 10h2.5L11.5 13" />
    </svg>
  ),
  "low-libido": ({ className }) => (
    <svg {...base} className={className}>
      <path d="M12 20s-7-4.4-7-9.2A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.8c0 1.6-.8 3.1-1.9 4.4" />
      <path d="M4 4l16 16" />
    </svg>
  ),
  bloating: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M8 4.5c0 2-2 2.5-2 5a6 6 0 0 0 12 0c0-3.5-3-4.5-3-7" />
      <path d="M10.5 13.5c.8.8 2.2.8 3 0" />
    </svg>
  ),

  // ── promise cards ──
  forecast: ({ className }) => (
    <svg {...base} className={className}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <path d="M8 14.5h.01M12 14.5h.01M16 14.5h.01" />
    </svg>
  ),
  score: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-4.5" />
      <circle cx="12" cy="17" r="1.2" />
    </svg>
  ),
  pattern: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M3 12c2 0 2-5 4-5s2 9 4 9 2-9 4-9 2 5 4 5" />
    </svg>
  ),
  doctor: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M12 11v5M9.5 13.5h5" />
    </svg>
  ),
  flame: ({ className }) => QuizIcon["hot-flashes"]({ className }),
  moon: ({ className }) => QuizIcon["night-sweats"]({ className }),
  fog: ({ className }) => QuizIcon["brain-fog"]({ className }),
  mood: ({ className }) => QuizIcon["mood-swings"]({ className }),
  sleep: ({ className }) => QuizIcon["sleep-problems"]({ className }),
  battery: ({ className }) => QuizIcon.fatigue({ className }),
  scale: ({ className }) => QuizIcon["weight-changes"]({ className }),
  joint: ({ className }) => QuizIcon["joint-pain"]({ className }),
  bolt: ({ className }) => QuizIcon.headaches({ className }),
  libido: ({ className }) => QuizIcon["low-libido"]({ className }),
  chat: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M20.5 11.7c0 3.9-3.8 7-8.5 7-.9 0-1.8-.1-2.6-.3L4 20.5l1.4-3.6c-1.2-1.3-1.9-2.9-1.9-4.6 0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 6.9Z" />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" />
    </svg>
  ),
  cycle: ({ className }) => (
    <svg {...base} className={className}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V7h-3.5" />
    </svg>
  ),
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = QuizIcon[name];
  if (!C) return null;
  return <C className={className} />;
}

export function LockIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </svg>
  );
}

export function CheckIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
