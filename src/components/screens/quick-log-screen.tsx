export function QuickLogScreen() {
  const symptoms = [
    { icon: "flame", label: "Hot flash", selected: true },
    { icon: "moon", label: "Night sweat", selected: false },
    { icon: "brain", label: "Brain fog", selected: true },
    { icon: "anxiety", label: "Anxiety", selected: false },
    { icon: "fatigue", label: "Fatigue", selected: false },
    { icon: "mood", label: "Mood", selected: false },
  ];

  const getIcon = (icon: string, selected: boolean) => {
    const color = selected ? "white" : "#4B5563";
    switch (icon) {
      case "flame":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2c1 3 4 6 4 10a4 4 0 1 1-8 0c0-4 3-7 4-10z" />
          </svg>
        );
      case "moon":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      case "brain":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
          </svg>
        );
      case "anxiety":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          </svg>
        );
      case "fatigue":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          </svg>
        );
      case "mood":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col relative">
      {/* Status Bar */}
      <div className="flex justify-between px-6 pt-10 pb-2 text-sm font-semibold text-[#111827]">
        <span>9:41</span>
        <span></span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-[20px] font-bold text-[#111827] mb-1">How&apos;s today?</h2>
          <p className="text-[13px] text-[#9CA3AF]">Tap what you&apos;re feeling</p>
        </div>

        {/* Symptom Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {symptoms.map((symptom, i) => (
            <div
              key={i}
              className={`rounded-xl py-4 px-2 text-center border-2 transition-colors ${
                symptom.selected
                  ? "border-[#111827] bg-[#F9FAFB]"
                  : "border-[#E5E7EB] bg-white"
              }`}
            >
              <div
                className={`w-9 h-9 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                  symptom.selected ? "bg-[#111827]" : "bg-[#F9FAFB]"
                }`}
              >
                <div className="w-5 h-5">{getIcon(symptom.icon, symptom.selected)}</div>
              </div>
              <span
                className={`text-[11px] ${
                  symptom.selected ? "text-[#111827] font-semibold" : "text-[#9CA3AF] font-medium"
                }`}
              >
                {symptom.label}
              </span>
            </div>
          ))}
        </div>

        {/* More Symptoms */}
        <p className="text-center text-[12px] text-[#9CA3AF] py-2">
          <span className="text-[#0891B2] font-semibold">+9 more</span> symptoms
        </p>

        {/* Intensity Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-[12px] text-[#4B5563] font-medium mb-3 text-center">Intensity</div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="flex-1 h-2 bg-[#059669] rounded" />
            <div className="flex-1 h-2 bg-[#84CC16] rounded" />
            <div className="flex-1 h-2 bg-[#F97316] rounded" />
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-[#9CA3AF]">Mild</span>
            <span className="text-[10px] text-[#9CA3AF]">Severe</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav with Save */}
      <div className="absolute bottom-3 left-3 right-3 bg-white rounded-2xl px-2 py-2 flex justify-around items-center shadow-md">
        <NavItem icon="home" label="Home" active={false} />
        <NavItem icon="patterns" label="Patterns" active={false} />
        <div className="w-12 h-12 bg-[#E11D48] rounded-full flex items-center justify-center -mt-6 shadow-lg">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <NavItem icon="report" label="Report" active={false} />
        <NavItem icon="profile" label="Profile" active={false} />
      </div>
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
