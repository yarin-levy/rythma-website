/**
 * Site-wide Organization + MobileApplication JSON-LD.
 *
 * This used to live in the root layout, which put "Perimenopause",
 * "Hot flashes" and applicationCategory "HealthApplication" into the HTML of
 * EVERY page — including /quiz, the Meta paid-traffic lander that must stay
 * neutral for Meta's crawler and the pixel's data-source category. The homepage
 * is also the standard, Google-preferred place for these two types, and blog
 * posts already carry their own BlogPosting/Breadcrumb/FAQ schema with an
 * embedded publisher Organization, so nothing loses coverage by moving it here.
 */
export function SiteSchema() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Rythma",
            url: "https://rythma.co",
            logo: "https://rythma.co/logo.svg",
            description:
              "Rythma is the period and symptom tracker built for the unpredictability of perimenopause — it learns your patterns and predicts difficult days before they arrive.",
            slogan: "Know your hard days before they hit.",
            knowsAbout: [
              "Perimenopause",
              "Perimenopause symptoms",
              "Menopause",
              "Hot flashes",
              "Hormone changes",
              "Menstrual cycle tracking",
              "Women's midlife health",
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "Rythma",
            operatingSystem: "iOS",
            applicationCategory: "HealthApplication",
            description:
              "Rythma learns your patterns and predicts perimenopause symptoms before they arrive, so you can plan your life around hard days.",
            url: "https://rythma.co",
            downloadUrl:
              "https://apps.apple.com/us/app/rythma-perimenopause-tracker/id6762185611",
            publisher: { "@type": "Organization", name: "Rythma", url: "https://rythma.co" },
          }),
        }}
      />
    </>
  );
}
