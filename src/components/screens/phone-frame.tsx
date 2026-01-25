import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  scale?: "xs" | "sm" | "md" | "lg";
}

export function PhoneFrame({ children, className, scale = "md" }: PhoneFrameProps) {
  // All sizes use the same base frame (280x580) with CSS transform scaling
  // This ensures screen content looks consistent across all sizes
  const baseFrame = {
    frame: "w-[280px] h-[580px]",
    notch: "w-[90px] h-[28px]",
    radius: "rounded-[44px]",
    innerRadius: "rounded-[36px]",
  };

  const scales: Record<string, { transform: string; wrapper: string }> = {
    xs: { transform: "scale(0.65)", wrapper: "w-[182px] h-[377px]" },
    sm: { transform: "scale(0.75)", wrapper: "w-[210px] h-[435px]" },
    md: { transform: "", wrapper: "" },
    lg: { transform: "scale(1.14)", wrapper: "w-[320px] h-[661px]" },
  };

  const s = scales[scale];

  // For scaled sizes, we need a wrapper to handle the scaled dimensions
  if (scale !== "md") {
    return (
      <div className={s.wrapper}>
        <div
          className={cn(
            "relative bg-[#F9FAFB] p-[8px]",
            "shadow-[0_25px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]",
            baseFrame.frame,
            baseFrame.radius,
            s.transform,
            "origin-top-left",
            className
          )}
        >
          {/* Dynamic Island */}
          <div className={cn("absolute top-[8px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-[14px] z-10", baseFrame.notch)} />

          {/* Screen */}
          <div className={cn("w-full h-full bg-[#F9FAFB] overflow-hidden", baseFrame.innerRadius)}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative bg-[#F9FAFB] p-[8px]",
        "shadow-[0_25px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]",
        baseFrame.frame,
        baseFrame.radius,
        className
      )}
    >
      {/* Dynamic Island */}
      <div className={cn("absolute top-[8px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-[14px] z-10", baseFrame.notch)} />

      {/* Screen */}
      <div className={cn("w-full h-full bg-[#F9FAFB] overflow-hidden", baseFrame.innerRadius)}>
        {children}
      </div>
    </div>
  );
}
