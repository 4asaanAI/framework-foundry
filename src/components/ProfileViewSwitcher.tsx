import { useAuth, PROFILES } from "@/contexts/AuthContext";

interface ProfileViewSwitcherProps {
  selected: string;
  onChange: (value: string) => void;
}

export function ProfileViewSwitcher({ selected, onChange }: ProfileViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
          selected === "all"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Layaa AI (all)
      </button>
      {PROFILES.map((p) => (
        <button
          key={p.email}
          onClick={() => onChange(p.name.toLowerCase())}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            selected === p.name.toLowerCase()
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {p.avatar ? (
            <img src={p.avatar} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
          ) : (
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: p.color + "20", color: p.color }}>
              {p.initials}
            </span>
          )}
          {p.name}
        </button>
      ))}
    </div>
  );
}
