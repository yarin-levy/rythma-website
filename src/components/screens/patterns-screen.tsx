export function PatternsScreen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-4 pt-8 pb-1 text-[11px] font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 overflow-hidden">
        {/* Main Pattern Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-2 border-2 border-[#E11D48] relative overflow-hidden">
          {/* Top gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, #E11D48 0%, #F97316 100%)" }}
          />

          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="bg-[#E11D48] text-white text-[8px] font-semibold px-2 py-0.5 rounded-full">
              Discovery
            </span>
            <span className="w-1 h-1 bg-[#059669] rounded-full animate-pulse" />
          </div>

          {/* Pattern Visual */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            {/* Sleep Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-[#CFFAFE] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0891B2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <span className="text-[8px] text-[#4B5563] font-medium">Poor sleep</span>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[13px] font-extrabold text-[#E11D48]">89%</span>
              <div
                className="w-6 h-0.5 rounded"
                style={{ background: "linear-gradient(90deg, #0891B2 0%, #E11D48 100%)" }}
              />
            </div>

            {/* Hot Flash Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2c1 3 4 6 4 10a4 4 0 1 1-8 0c0-4 3-7 4-10z" />
                </svg>
              </div>
              <span className="text-[8px] text-[#4B5563] font-medium">Hot flashes</span>
            </div>
          </div>

          <p className="text-center text-[10px] font-semibold text-[#111827]">
            Less than 6h sleep = symptoms
          </p>
        </div>

        {/* Mini Pattern Cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { correlation: "72%", description: "Caffeine -> Insomnia", color: "#F97316" },
            { correlation: "81%", description: "Exercise -> Better", color: "#059669" },
            { correlation: "68%", description: "Alcohol -> Sweats", color: "#F97316" },
            { correlation: "65%", description: "Stress -> Symptoms", color: "#E11D48" },
          ].map((pattern, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-2.5 shadow-sm"
            >
              <div className="text-[16px] font-extrabold text-[#111827] mb-0.5">{pattern.correlation}</div>
              <div className="text-[8px] text-[#9CA3AF] leading-tight">{pattern.description}</div>
              <div className="w-full h-[2px] bg-[#E5E7EB] rounded mt-2 overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: pattern.correlation,
                    background: pattern.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="patterns" />
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
