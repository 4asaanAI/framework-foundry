import { PROFILES, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProfilePicker() {
  const { signIn, loading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mb-10 text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Layaa OS</h1>
        <p className="text-sm text-muted-foreground mt-2">Who's working today?</p>
      </div>

      <div className="flex gap-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        {PROFILES.map((p) => (
          <button
            key={p.email}
            onClick={() => signIn(p)}
            disabled={loading}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 hover:bg-card hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold transition-transform group-hover:scale-110"
              style={{ backgroundColor: p.color + "20", color: p.color }}
            >
              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : p.initials}
            </div>
            <span className="text-sm font-semibold text-foreground">{p.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted-foreground/50">Select your profile to continue</p>
    </div>
  );
}
