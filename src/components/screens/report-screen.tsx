export function ReportScreen() {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-4 pt-8 pb-1 text-[11px] font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 overflow-hidden">
        {/* Report Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E5E7EB] mb-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)" }}
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <div className="text-[12px] font-bold text-[#111827]">Symptom Report</div>
              <div className="text-[9px] text-[#9CA3AF]">Jan 1 - 21, 2026</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            <div className="bg-[#F9FAFB] rounded-lg py-2 px-1 text-center">
              <div className="text-[16px] font-extrabold text-[#111827]">
                47<span className="text-[8px] text-[#E11D48] ml-0.5">+</span>
              </div>
              <div className="text-[7px] text-[#9CA3AF] mt-0.5">Hot flashes</div>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg py-2 px-1 text-center">
              <div className="text-[16px] font-extrabold text-[#111827]">
                12<span className="text-[8px] text-[#059669] ml-0.5">-</span>
              </div>
              <div className="text-[7px] text-[#9CA3AF] mt-0.5">Night sweats</div>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg py-2 px-1 text-center">
              <div className="text-[16px] font-extrabold text-[#111827]">8</div>
              <div className="text-[7px] text-[#9CA3AF] mt-0.5">Hard days</div>
            </div>
          </div>

          {/* Report List */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[9px] text-[#4B5563]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] flex-shrink-0" />
              <span>Cycle: 24-47 days</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-[#4B5563]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
              <span>Trigger: Poor sleep</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-[#4B5563]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0891B2] flex-shrink-0" />
              <span>4 patterns found</span>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button className="w-full bg-[#111827] text-white rounded-xl py-2.5 mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share with Doctor
        </button>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="report" />
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
