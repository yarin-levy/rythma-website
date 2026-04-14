export function CalendarScreen() {
  const calendarDays = [
    { day: "", type: "empty" },
    { day: "", type: "empty" },
    { day: "", type: "empty" },
    { day: "1", type: "period" },
    { day: "2", type: "period" },
    { day: "3", type: "period" },
    { day: "4", type: "period" },
    { day: "5", type: "period" },
    { day: "6", type: "good" },
    { day: "7", type: "good" },
    { day: "8", type: "good" },
    { day: "9", type: "normal" },
    { day: "10", type: "normal" },
    { day: "11", type: "normal" },
    { day: "12", type: "normal" },
    { day: "13", type: "normal" },
    { day: "14", type: "hard" },
    { day: "15", type: "hard" },
    { day: "16", type: "normal" },
    { day: "17", type: "good" },
    { day: "18", type: "good" },
    { day: "19", type: "normal" },
    { day: "20", type: "normal" },
    { day: "21", type: "normal" },
    { day: "22", type: "hard" },
    { day: "23", type: "today" },
    { day: "24", type: "predicted" },
    { day: "25", type: "predicted" },
    { day: "26", type: "muted" },
    { day: "27", type: "muted" },
    { day: "28", type: "muted" },
    { day: "29", type: "muted" },
    { day: "30", type: "muted" },
    { day: "31", type: "muted" },
    { day: "", type: "empty" },
  ];

  const getDayStyle = (type: string) => {
    switch (type) {
      case "period":
        return "bg-[#00464A] text-white";
      case "good":
        return "bg-[rgba(45, 125, 95, 0.12)] text-[#2D7D5F]";
      case "hard":
        return "bg-[rgba(196, 135, 46, 0.12)] text-[#C4872E]";
      case "today":
        return "bg-[#1A1C1C] text-white font-bold";
      case "predicted":
        return "bg-[rgba(0, 70, 74, 0.12)] text-[#00464A]";
      case "muted":
        return "text-[#9EA3A3]";
      case "empty":
        return "text-transparent";
      default:
        return "text-[#1A1C1C]";
    }
  };

  return (
    <div className="h-full bg-[#F9F9F8] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-4 pt-8 pb-1 text-[11px] font-semibold text-[#1A1C1C]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 overflow-hidden">
        {/* Calendar Card */}
        <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] font-bold text-[#1A1C1C]">January 2026</span>
            <div className="flex gap-1">
              <button className="w-5 h-5 rounded-md border border-[#BEC8C9] bg-white text-[#6B7070] text-[9px] flex items-center justify-center">
                &lt;
              </button>
              <button className="w-5 h-5 rounded-md border border-[#BEC8C9] bg-white text-[#6B7070] text-[9px] flex items-center justify-center">
                &gt;
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center text-[8px] font-semibold text-[#9EA3A3] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {calendarDays.map((item, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center text-[9px] font-medium rounded-full ${getDayStyle(item.type)}`}
              >
                {item.day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-2.5 py-1">
            <div className="flex items-center gap-1 text-[8px] text-[#9EA3A3]">
              <div className="w-2 h-2 rounded-full bg-[#00464A]" />
              Period
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#9EA3A3]">
              <div className="w-2 h-2 rounded-full bg-[rgba(196, 135, 46, 0.12)]" />
              Hard
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#9EA3A3]">
              <div className="w-2 h-2 rounded-full bg-[rgba(45, 125, 95, 0.12)]" />
              Good
            </div>
          </div>
        </div>

        {/* Stage Card */}
        <div
          className="rounded-xl p-2.5 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, rgba(0, 70, 74, 0.06) 0%, rgba(0, 70, 74, 0.1) 100%)" }}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-[#00464A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[8px] text-[#9EA3A3]">Current stage</div>
            <div className="text-[11px] font-bold text-[#1A1C1C]">Perimenopause</div>
            <div className="text-[8px] text-[#6B7070]">Day 23 of cycle</div>
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
      <div className="w-9 h-9 bg-[#1A1C1C] rounded-full flex items-center justify-center -mt-5 shadow-lg">
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
      <div className={`w-4 h-4 ${active ? "text-[#00464A]" : "text-[#9EA3A3]"}`}>{icons[icon]}</div>
      <span className={`text-[7px] ${active ? "text-[#00464A] font-semibold" : "text-[#9EA3A3]"}`}>
        {label}
      </span>
    </div>
  );
}
