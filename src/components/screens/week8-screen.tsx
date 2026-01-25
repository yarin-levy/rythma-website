export function Week8Screen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-6 pt-10 pb-2 text-sm font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-hidden">
        {/* Success Card */}
        <div
          className="rounded-xl p-5 text-white text-center mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)" }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-1/2 -right-[30%] w-[140px] h-[140px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex bg-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold mb-2">
              Week 8
            </div>
            <h2 className="text-[22px] font-bold mb-1">Rhythm Mapped</h2>
            <p className="text-[13px] opacity-90">Your patterns are unlocked</p>
          </div>
        </div>

        {/* Journey Timeline Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          {/* Timeline Dots */}
          <div className="flex items-center justify-center gap-1.5 py-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#059669]" />
            ))}
            <div className="w-3 h-3 rounded-full bg-[#059669] shadow-[0_0_0_3px_#D1FAE5]" />
          </div>

          {/* Accuracy Circle */}
          <div className="flex justify-center py-2">
            <div className="relative w-[100px] h-[100px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset="40"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-[28px] font-extrabold text-[#059669] leading-none">84</span>
                <span className="text-[14px] font-semibold text-[#059669]">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl py-3 px-2 text-center shadow-sm">
            <div className="text-[24px] font-extrabold text-[#E11D48] leading-none">4</div>
            <div className="text-[10px] text-[#9CA3AF] mt-1">Patterns</div>
          </div>
          <div className="bg-white rounded-xl py-3 px-2 text-center shadow-sm">
            <div className="text-[24px] font-extrabold text-[#F97316] leading-none">56</div>
            <div className="text-[10px] text-[#9CA3AF] mt-1">Days</div>
          </div>
          <div className="bg-white rounded-xl py-3 px-2 text-center shadow-sm">
            <div className="text-[24px] font-extrabold text-[#0891B2] leading-none">23</div>
            <div className="text-[10px] text-[#9CA3AF] mt-1">Predictions</div>
          </div>
        </div>

        {/* Transformation Note */}
        <div
          className="rounded-lg py-3 px-4 text-center text-[14px] font-semibold text-[#111827]"
          style={{ background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)" }}
        >
          No more guessing
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
