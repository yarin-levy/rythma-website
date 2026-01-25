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
    <section className="py-8 md:py-20 bg-[#F9FAFB]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4 md:mb-12">
          Sound familiar?
        </h2>

        <div className="grid gap-2.5 md:grid-cols-3 md:gap-5">
          {painPoints.map((item, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-4 md:p-6 border-2 ${item.color}`}
            >
              <div className={`absolute -top-2.5 left-4 text-3xl md:text-5xl font-serif ${item.quoteColor}`}>&ldquo;</div>
              <p className="text-sm md:text-lg text-foreground font-medium leading-[1.5] pt-2">
                {item.quote}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 md:mt-12 text-center text-base md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          You&apos;re not broken. You&apos;re in perimenopause.
          <span className="block mt-1.5 text-raspberry font-medium">And Rythma can help.</span>
        </p>
      </div>
    </section>
  );
}
