// Landing copy (screen 1) — deliberately kept in its own module.
//
// Screen 1 is the ONLY server-rendered screen. Everything from screen 2 on
// (questions, beats, results) lives in lib/quiz-data.ts and is pulled in by a
// lazily-imported, ssr:false chunk after the first tap, so no health-flavored
// copy ever appears in the HTML at rythma.co/quiz. If landing copy imported
// quiz-data.ts, the whole module would risk being pulled into the initial
// bundle and defeat that. Keep this file free of any screen 2+ copy.

export const LANDING = {
  headline: "Everything changed, and nobody warned you it could start this early.",
  sub: "Take the 2-minute quiz and get your Peri Score profile.",
  cta: "Start the quiz",
  // Names the destination up front. Two reasons: she shouldn't discover she's
  // being sent to an App Store only after answering 8 questions, and "iPhone"
  // lets Android traffic bounce here on screen 1 instead of completing the whole
  // funnel and hitting a dead end.
  trust: "Free · No account needed · For the Rythma app on iPhone",
};
