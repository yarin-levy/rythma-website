/**
 * FAQ data for blog posts. Auto-populated by writing skills.
 * Generates FAQPage schema markup for AI search engine extraction.
 */

export interface FAQ {
  question: string;
  answer: string;
}

export const blogFAQs: Record<string, FAQ[]> = {
  "what-is-perimenopause": [
    {
      question: "What is the difference between perimenopause and menopause?",
      answer:
        "Perimenopause is the transition phase when hormones begin to shift and cycles become irregular, lasting typically four to eight years. Menopause is the point at which a woman has gone 12 consecutive months without a period — the official end of the transition. After that point, she is postmenopausal. In everyday language the two words are often used interchangeably, but clinically they refer to different stages.",
    },
    {
      question: "At what age does perimenopause start?",
      answer:
        "Most women begin perimenopause in their mid-to-late 40s, according to the U.S. Office on Women's Health and the NHS, with average menopause occurring around age 51 to 52 in the United States. Starting in the early 40s or even late 30s is within the normal range — NICE NG23 notes perimenopause can begin from the early 40s. Approximately 1 in 100 women experience menopause before age 40 (premature ovarian insufficiency), which has distinct clinical management.",
    },
    {
      question: "How long does perimenopause last?",
      answer:
        "The transition typically lasts four to eight years, though individual timelines vary widely. The U.S. Office on Women's Health cites a range of two to eight years. SWAN research has shown that vasomotor symptoms specifically last a median of 7.4 years across the transition. A woman who develops hot flashes early tends to experience a longer overall duration than one whose symptoms start in late perimenopause.",
    },
    {
      question: "Can you still get pregnant during perimenopause?",
      answer:
        "Yes. Because ovulation still occurs — even if less frequently — pregnancy remains possible throughout perimenopause until menopause is confirmed (12 months without a period). ACOG advises that contraception should be continued until menopause is reached for women who wish to avoid pregnancy. A clinician can advise on appropriate options for this stage.",
    },
    {
      question: "How do you know if you're in perimenopause?",
      answer:
        "The clearest early signal is a change in your cycle — periods arriving on a different schedule, especially if cycle length varies by seven or more days from its usual pattern. Hot flashes, sleep disruption, and mood changes alongside cycle changes strongly suggest perimenopause in women in their 40s. NICE NG23 advises that in women aged 45 and older, symptoms alone are enough for a clinical diagnosis — no blood test is required. If you're under 45, a clinician may order FSH tests, though a single normal result cannot rule out perimenopause.",
    },
  ],
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
