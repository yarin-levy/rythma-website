import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  scale?: "xs" | "sm" | "md" | "lg";
}

export function PhoneFrame({ children, className, scale = "md" }: PhoneFrameProps) {
  // Base size is md (280x580), other sizes use CSS transform scaling
  const scaleFactors = {
    xs: 0.62,
    sm: 0.85,
    md: 1,
    lg: 1.14,
  };

  const scaleFactor = scaleFactors[scale];

  // Calculate wrapper dimensions to contain the scaled frame
  const baseWidth = 280;
  const baseHeight = 580;
  const wrapperWidth = baseWidth * scaleFactor;
  const wrapperHeight = baseHeight * scaleFactor;

  return (
    <div
      className="relative"
      style={{ width: wrapperWidth, height: wrapperHeight }}
    >
      <div
        className={cn(
          "absolute top-0 left-0 origin-top-left",
          "w-[280px] h-[580px]",
          "bg-[#F9FAFB] p-[8px]",
          "shadow-[0_25px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]",
          "rounded-[44px]",
          className
        )}
        style={{ transform: `scale(${scaleFactor})` }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-[14px] z-10 w-[90px] h-[28px]" />

        {/* Screen */}
        <div className="w-full h-full bg-[#F9FAFB] overflow-hidden rounded-[36px]">
          {children}
        </div>
      </div>
    </div>
  );
}
