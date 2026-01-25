import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  scale?: "xs" | "sm" | "md" | "lg";
}

export function PhoneFrame({ children, className, scale = "md" }: PhoneFrameProps) {
  const sizes = {
    xs: { frame: "w-[200px] h-[410px]", notch: "w-[60px] h-[18px]", radius: "rounded-[30px]", innerRadius: "rounded-[24px]" },
    sm: { frame: "w-[240px] h-[490px]", notch: "w-[70px] h-[22px]", radius: "rounded-[36px]", innerRadius: "rounded-[28px]" },
    md: { frame: "w-[280px] h-[580px]", notch: "w-[90px] h-[28px]", radius: "rounded-[44px]", innerRadius: "rounded-[36px]" },
    lg: { frame: "w-[320px] h-[660px]", notch: "w-[100px] h-[32px]", radius: "rounded-[50px]", innerRadius: "rounded-[42px]" },
  };

  const s = sizes[scale];

  return (
    <div
      className={cn(
        "relative bg-[#F9FAFB] p-[8px]",
        "shadow-[0_25px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]",
        s.frame,
        s.radius,
        className
      )}
    >
      {/* Dynamic Island */}
      <div className={cn("absolute top-[8px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-[14px] z-10", s.notch)} />

      {/* Screen */}
      <div className={cn("w-full h-full bg-[#F9FAFB] overflow-hidden", s.innerRadius)}>
        {children}
      </div>
    </div>
  );
}
