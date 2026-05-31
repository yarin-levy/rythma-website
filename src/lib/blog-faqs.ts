/**
 * FAQ data for blog posts. Auto-populated by writing skills.
 * Generates FAQPage schema markup for AI search engine extraction.
 */

export interface FAQ {
  question: string;
  answer: string;
}

export const blogFAQs: Record<string, FAQ[]> = {
  "perimenopause-symptoms-statistics-2026": [
    {
      question: "How long do perimenopause symptoms last?",
      answer:
        "Hot flashes and night sweats last a median of 7.4 years across the menopause transition, according to the SWAN study, and continue for a median of 4.5 years after the final period. For women whose symptoms start early, the median exceeds 11.8 years. The U.S. Office on Women's Health notes hot flashes can persist for an average of about nine years and up to 14. Perimenopause is typically a multi-year experience, and an early start tends to mean a longer overall duration, not a shorter one.",
    },
    {
      question: "What is the most common perimenopause symptom?",
      answer:
        "Fatigue is the most commonly reported perimenopause symptom, named by 83% of women aged 35 and older in an international survey of more than 17,000 women across 158 countries analyzed by The Menopause Society. It tied with physical and mental exhaustion, followed by irritability (80%), depressive mood (77%), sleep problems (76%), and anxiety (75%). Fatigue outranks hot flashes, even though hot flashes are the symptom most people recognize (71%) as a sign of perimenopause.",
    },
    {
      question: "Does perimenopause increase the risk of depression?",
      answer:
        "Yes. The odds of significant depressive symptoms are about 1.71 times higher in late perimenopause compared with before the transition, according to SWAN data on 3,193 women. The risk rises through the transition — roughly 1.30 times the odds in early perimenopause and 1.57 after menopause. This does not mean most women develop clinical depression, and factors like poor sleep, hot flashes, and life stress also contribute, but mood vulnerability genuinely increases during late perimenopause.",
    },
    {
      question: "Is brain fog a real perimenopause symptom?",
      answer:
        "Yes. Between 44% and 62% of women report subjective cognitive decline during the menopause transition, according to a narrative review of population-based studies. SWAN data from 16,065 women found complaints of forgetfulness rose from 31% before the transition to 44% in early perimenopause. The symptoms typically affect attention, processing speed, and word-finding, and for most women they are temporary, tracking with the same hormonal fluctuations behind hot flashes and disrupted sleep.",
    },
    {
      question: "Where do these perimenopause statistics come from?",
      answer:
        "These figures come from primary and authoritative sources: the Study of Women's Health Across the Nation (SWAN), a long-running U.S. cohort of over 3,300 women; The Menopause Society's analysis of an international survey of more than 17,000 women; the U.S. Office on Women's Health; Mayo Clinic Proceedings; the World Health Organization; and a peer-reviewed review of menopause and cognition. Each statistic in the article links directly to its source.",
    },
  ],
};
