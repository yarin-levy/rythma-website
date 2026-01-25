import { Badge } from "@/components/ui/badge";
import { TestimonialMarquee } from "@/components/testimonials/testimonial-marquee";

export type Testimonial = {
  name: string;
  date: string;
  title: string;
  content: string;
  avatar?: string;
  rating: number;
};

const testimonials = [
  {
    name: "Michelle, 49",
    date: "Marketing Director",
    title: "Finally understanding my patterns",
    content: `"I finally stopped feeling crazy. Rythma showed me that my 'random' hot flashes happen every time I sleep poorly. Now I prioritize sleep."`,
    rating: 5,
  },
  {
    name: "Linda, 52",
    date: "Teacher",
    title: "My doctor finally listened",
    content: `"My doctor actually listened when I showed her the report. First time I felt taken seriously in years."`,
    rating: 5,
  },
  {
    name: "Amanda, 46",
    date: "Consultant",
    title: "Game changer",
    content: `"I went from dreading every day to actually being able to plan. Game changer."`,
    rating: 5,
  },
  {
    name: "Patricia, 48",
    date: "Accountant",
    title: "Finally an app that gets it",
    content: `"Finally an app that doesn't tell me I'm 'late' every month. It understands that irregular IS my normal."`,
    rating: 5,
  },
  {
    name: "Karen, 51",
    date: "Nurse",
    title: "Wish I found this sooner",
    content: `"After 2 years of confusion, Rythma helped me see my symptoms aren't random. I wish I'd found this sooner."`,
    rating: 5,
  },
  {
    name: "Diane, 47",
    date: "Real Estate Agent",
    title: "No more surprise bad days",
    content: `"I used to cancel showings last minute. Now I can schedule around my predicted low-energy days."`,
    rating: 5,
  },
  {
    name: "Rachel, 50",
    date: "Software Engineer",
    title: "Data-driven approach",
    content: `"I love that it's based on MY data, not generic averages. The predictions are scary accurate."`,
    rating: 5,
  },
  {
    name: "Teresa, 53",
    date: "Yoga Instructor",
    title: "Finally feel in control",
    content: `"Understanding my cycle patterns has helped me adapt my classes and feel more in control of my body."`,
    rating: 5,
  },
  {
    name: "Nicole, 45",
    date: "Lawyer",
    title: "Validated my experience",
    content: `"I thought I was losing my mind. Rythma showed me there's a clear pattern to my brain fog days."`,
    rating: 5,
  },
  {
    name: "Barbara, 54",
    date: "HR Manager",
    title: "Transformed my work life",
    content: `"I schedule important meetings when Rythma predicts I'll be at my best. My confidence is back."`,
    rating: 5,
  },
  {
    name: "Christine, 48",
    date: "Chef",
    title: "Kitchen-proof tracking",
    content: `"30-second logging is perfect for my hectic schedule. I actually stick with it."`,
    rating: 5,
  },
  {
    name: "Maria, 51",
    date: "Physical Therapist",
    title: "Medically insightful",
    content: `"The doctor report feature helped my gynecologist adjust my treatment plan. So helpful."`,
    rating: 5,
  },
] satisfies Testimonial[];

export function Testimonials() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-14 md:py-25">
      <Badge variant="secondary" className="mb-2 uppercase">
        Testimonials
      </Badge>
      <h2 className="text-center text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
        What women
        <span className="text-muted-foreground block">are saying</span>
      </h2>
      <div className="relative w-[calc(100%+3rem)] overflow-x-hidden py-4 lg:w-full mt-6">
        <TestimonialMarquee testimonials={testimonials} className="mb-4" />
        <TestimonialMarquee testimonials={testimonials} reverse />
      </div>
    </div>
  );
}
