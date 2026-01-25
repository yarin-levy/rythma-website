export function PredictionScreen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-4 pt-8 pb-1 text-[11px] font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 overflow-hidden">
        <p className="text-[11px] text-[#4B5563] mb-2">
          Good morning, <span className="text-[#111827] font-medium">Sarah</span>
        </p>

        {/* Prediction Hero Card */}
        <div
          className="rounded-2xl p-3.5 text-white mb-2.5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%)",
          }}
        >
          <div
            className="absolute -top-1/2 -right-1/4 w-[100px] h-[100px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-1 text-[9px] font-medium opacity-90 mb-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span>Heads up</span>
            </div>

            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-[44px] font-extrabold leading-none tracking-[-2px]">2</span>
              <span className="text-[15px] font-medium opacity-90">days</span>
            </div>
            <p className="text-[11px] opacity-85">until hard day</p>

            <div className="flex gap-1.5 mt-2.5">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-[9px] font-medium">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                Brain fog
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-[9px] font-medium">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                </svg>
                Fatigue
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
              This Week
            </span>
            <span className="text-[8px] font-semibold text-[#4B5563] border border-[#E5E7EB] px-1.5 py-0.5 rounded-full">
              84%
            </span>
          </div>

          <div className="flex justify-between items-end h-[55px]">
            {[
              { day: "Today", height: 40, level: "medium", active: true },
              { day: "Tue", height: 55, level: "medium" },
              { day: "Wed", height: 100, level: "high" },
              { day: "Thu", height: 80, level: "high" },
              { day: "Fri", height: 25, level: "low" },
            ].map((item) => (
              <div key={item.day} className="flex flex-col items-center flex-1">
                <div className="h-[32px] flex items-end mb-1">
                  <div
                    className="w-3.5 rounded-[3px]"
                    style={{
                      height: `${item.height}%`,
                      background:
                        item.level === "high"
                          ? "linear-gradient(180deg, #E11D48 0%, #BE123C 100%)"
                          : item.level === "medium"
                            ? "linear-gradient(180deg, #F97316 0%, #EA580C 100%)"
                            : "linear-gradient(180deg, #0891B2 0%, #0E7490 100%)",
                    }}
                  />
                </div>
                <span
                  className={`text-[8px] ${
                    item.active ? "text-[#E11D48] font-bold" : "text-[#9CA3AF] font-medium"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="home" />
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
