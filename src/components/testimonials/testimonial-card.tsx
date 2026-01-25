import type { Testimonial } from "@/components/testimonials/testimonials";

type Props = {
  testimonial: Testimonial;
};

// Map each testimonial name to a specific female portrait from RandomUser
const avatarMap: Record<string, string> = {
  "Michelle": "https://randomuser.me/api/portraits/women/91.jpg",
  "Linda": "https://randomuser.me/api/portraits/women/45.jpg",
  "Amanda": "https://randomuser.me/api/portraits/women/52.jpg",
  "Patricia": "https://randomuser.me/api/portraits/women/76.jpg",
  "Karen": "https://randomuser.me/api/portraits/women/83.jpg",
  "Diane": "https://randomuser.me/api/portraits/women/68.jpg",
  "Rachel": "https://randomuser.me/api/portraits/women/32.jpg",
  "Teresa": "https://randomuser.me/api/portraits/women/89.jpg",
  "Nicole": "https://randomuser.me/api/portraits/women/63.jpg",
  "Barbara": "https://randomuser.me/api/portraits/women/57.jpg",
  "Christine": "https://randomuser.me/api/portraits/women/71.jpg",
  "Maria": "https://randomuser.me/api/portraits/women/94.jpg",
};

export function TestimonialCard({ testimonial }: Props) {
  // Extract just the first name
  const firstName = testimonial.name.split(",")[0].trim();

  // Get the mapped avatar or use a default
  const avatarUrl = avatarMap[firstName] || "https://randomuser.me/api/portraits/women/45.jpg";

  return (
    <div className="bg-card flex h-auto w-xs flex-col gap-2 rounded-xl p-7 shadow-md md:w-[24rem] md:p-8">
      <div className="mb-2 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={`${firstName}'s photo`}
          width={52}
          height={52}
          className="w-[52px] h-[52px] rounded-full object-cover flex-shrink-0"
          style={{
            border: "3px solid rgba(255,255,255,0.3)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          loading="lazy"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{testimonial.name}</span>
          <span className="text-muted-foreground text-sm">{testimonial.date}</span>
        </div>
      </div>
      <div className="text-sm text-wrap md:text-base leading-relaxed text-muted-foreground">{testimonial.content}</div>
    </div>
  );
}
