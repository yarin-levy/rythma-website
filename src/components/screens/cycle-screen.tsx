export function CycleScreen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-4 pt-8 pb-1 text-[11px] font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 overflow-hidden">
        {/* Cycle Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Your Cycle
            </span>
          </div>

          {/* Cycle Visual */}
          <div className="flex flex-col items-center py-1 pb-2">
            <div className="relative w-[100px] h-[100px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891B2" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="55"
                  fill="none"
                  stroke="url(#cycleGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="310"
                  strokeDashoffset="90"
                />
                <circle cx="118" cy="85" r="5" fill="#0891B2" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[20px] font-extrabold text-[#0891B2] tracking-tight whitespace-nowrap">
                  24-47
                </div>
                <div className="text-[8px] text-[#9CA3AF] font-medium">day range</div>
              </div>
            </div>
            <div className="flex justify-between w-[100px] mt-1">
              <span className="text-[8px] text-[#9CA3AF] font-medium">21d</span>
              <span className="text-[8px] text-[#9CA3AF] font-medium">50d+</span>
            </div>
          </div>
        </div>

        {/* Validation Banner */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-center gap-2 text-white mb-2"
          style={{ background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)" }}
        >
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold">Normal for perimenopause</span>
        </div>

        {/* Period Window Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-[9px] text-[#9CA3AF] font-medium mb-1">Next Period Window</div>
          <div className="text-[18px] font-bold text-[#E11D48] tracking-tight">Jan 28 - Feb 8</div>
          <div className="text-[9px] text-[#9CA3AF] mt-0.5">A range, not a guess</div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="profile" />
    </div>
  );
}

function BottomNav({ activeTab }: { activeTab: string }) {
  return (
    <div className="absolute bottom-2 left-2 right-2 bg-white rounded-2xl px-1 py-1.5 flex justify-around items-center shadow-md">
      <NavItem icon="home" label="Home" active={activeTab === "home"} />
      <NavItem icon="patterns" label="Patterns" active={activeTab === "patterns"} />
      <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center -mt-5 shadow-lg">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    <div className="flex flex-col items-center gap-0.5 px-1">
      <div className={`w-4 h-4 ${active ? "text-[#E11D48]" : "text-[#9CA3AF]"}`}>{icons[icon]}</div>
      <span className={`text-[7px] ${active ? "text-[#E11D48] font-semibold" : "text-[#9CA3AF]"}`}>
        {label}
      </span>
    </div>
  );
}
