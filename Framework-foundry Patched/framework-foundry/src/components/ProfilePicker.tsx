import { useState } from "react";
import { PROFILES, type Profile } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock } from "lucide-react";

export function ProfilePicker() {
  const { signIn, loading } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleProfileClick = async (p: Profile) => {
    setSubmitting(true);
    setError("");
    const result = await signIn(p);
    if (!result.success) {
      setSelectedProfile(p);
      setError(result.error || "Login failed");
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setSelectedProfile(null);
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !password.trim()) return;

    setSubmitting(true);
    setError("");
    const result = await signIn(selectedProfile, password.trim());
    if (!result.success) {
      setError(result.error || "Login failed");
      setSubmitting(false);
    }
  };

  // Password entry screen
  if (selectedProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-sm px-6">
          <div className="flex flex-col items-center mb-8 animate-fade-in">
            {selectedProfile.avatar ? (
              <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-20 h-20 rounded-2xl object-cover mb-4" />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4"
                style={{ backgroundColor: selectedProfile.color + "20", color: selectedProfile.color }}
              >
                {selectedProfile.initials}
              </div>
            )}
            <h2 className="text-xl font-semibold text-foreground">{selectedProfile.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Password"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={!password.trim() || submitting || loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {submitting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              Back to profiles
            </button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground/50 text-center">
            Layaa OS — Layaa AI Private Limited
          </p>
        </div>
      </div>
    );
  }

  // Profile selection screen
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
            onClick={() => handleProfileClick(p)}
            disabled={loading}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl transition-all duration-300 hover:bg-card hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {p.avatar ? (
              <img src={p.avatar} alt={p.name} className="w-24 h-24 rounded-2xl object-cover transition-transform group-hover:scale-110" />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold transition-transform group-hover:scale-110"
                style={{ backgroundColor: p.color + "20", color: p.color }}
              >
                {p.initials}
              </div>
            )}
            <span className="text-sm font-semibold text-foreground">{p.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted-foreground/50">Select your profile to continue</p>
    </div>
  );
}
