const painPoints = [
  {
    quote: "My cycle is all over the place. 26 days, then 45, then 31...",
    color: "bg-raspberry/10 border-raspberry/20",
    quoteColor: "text-raspberry",
  },
  {
    quote: "I never know when a bad day will hit. Yesterday I had to cancel an important meeting.",
    color: "bg-tangerine/10 border-tangerine/20",
    quoteColor: "text-tangerine",
  },
  {
    quote: "My doctor said it's 'just stress.' I know something else is going on.",
    color: "bg-cyan/10 border-cyan/20",
    quoteColor: "text-cyan",
  },
];

export function PainPoints() {
  return (
    <section className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <h2 className="text-center text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl mb-10 md:mb-14">
          Sound familiar?
        </h2>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {painPoints.map((item, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-7 md:p-8 border-2 ${item.color}`}
            >
              <div className={`absolute -top-4 left-6 text-5xl md:text-6xl font-serif ${item.quoteColor}`}>&ldquo;</div>
              <p className="text-lg md:text-xl text-foreground font-medium leading-[1.5] pt-4">
                {item.quote}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 md:mt-14 text-center text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          You&apos;re not broken. You&apos;re in perimenopause.
          <span className="block mt-2 text-raspberry font-medium">And Rythma can help.</span>
        </p>
      </div>
    </section>
  );
}
