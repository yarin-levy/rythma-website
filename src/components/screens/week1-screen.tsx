export function Week1Screen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-6 pt-10 pb-2 text-sm font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-hidden">
        {/* Week 1 Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E5E7EB] text-[#4B5563] px-3 py-1.5 rounded-full text-[11px] font-semibold mb-3">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Week 1 of 8
          </div>
          <h2 className="text-[18px] font-bold text-[#111827] mb-1">Learning Your Rhythm</h2>
          <p className="text-[13px] text-[#9CA3AF]">Keep logging, patterns are emerging</p>
        </div>

        {/* Empty Prediction Card */}
        <div className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-xl p-5 text-center mb-4">
          <div className="w-12 h-12 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-[14px] font-semibold text-[#111827] mb-1">Predictions Coming Soon</h3>
          <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
            After 3-4 weeks of data, you&apos;ll start seeing symptom forecasts here
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-semibold text-[#4B5563]">Journey to insights</span>
            <span className="text-[11px] font-bold text-[#E11D48]">Week 1 of 8</span>
          </div>
          <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "12.5%",
                background: "linear-gradient(90deg, #E11D48 0%, #F97316 100%)",
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-[#9CA3AF]">Start</span>
            <span className="text-[10px] text-[#9CA3AF]">First patterns</span>
            <span className="text-[10px] text-[#9CA3AF]">Full insights</span>
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-[#CFFAFE] rounded-xl p-4 flex gap-3 items-start">
          <div className="w-8 h-8 bg-[#0891B2] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4m-7-7H2m20 0h-3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
            </svg>
          </div>
          <p className="text-[12px] text-[#4B5563] leading-relaxed">
            <span className="font-semibold text-[#111827]">Tip:</span> Log at the same time each day for best results. Even &quot;good days&quot; help us learn.
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="home" />
    </div>
  );
}

function BottomNav({ activeTab }: { activeTab: string }) {
  return (
    <div className="absolute bottom-3 left-3 right-3 bg-white rounded-2xl px-2 py-2 flex justify-around items-center shadow-md">
      <NavItem icon="home" label="Home" active={activeTab === "home"} />
      <NavItem icon="patterns" label="Patterns" active={activeTab === "patterns"} />
      <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center -mt-6 shadow-lg">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <NavItem icon="report" label="Report" active={activeTab === "report"} />
      <NavItem icon="profile" label="Profile" active={activeTab === "profile"} />
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    patterns: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    report: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center gap-0.5 px-1.5">
      <div className={`w-5 h-5 ${active ? "text-[#E11D48]" : "text-[#9CA3AF]"}`}>{icons[icon]}</div>
      <span className={`text-[9px] ${active ? "text-[#E11D48] font-semibold" : "text-[#9CA3AF]"}`}>
        {label}
      </span>
    </div>
  );
}
