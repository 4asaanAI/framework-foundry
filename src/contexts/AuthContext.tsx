import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  name: string;
  initials: string;
  email: string;
  color: string;
  personalAgentName: string; // name of the personal assistant agent
}

export const PROFILES: Profile[] = [
  { name: "Abhimanyu", initials: "A", email: "abhimanyu@layaa.local", color: "#E87A2E", personalAgentName: "Arya" },
  { name: "Shubham", initials: "S", email: "shubham@layaa.local", color: "#2B5797", personalAgentName: "Ananya" },
];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (profile: Profile) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const p = PROFILES.find((p) => p.email === u.email) ?? null;
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const p = PROFILES.find((p) => p.email === u.email) ?? null;
        setProfile(p);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (p: Profile) => {
    setLoading(true);
    const password = "Layaa2024!Secure";
    // Try sign in first
    const { error } = await supabase.auth.signInWithPassword({ email: p.email, password });
    if (error) {
      // If user doesn't exist, sign up (auto-confirmed)
      const { error: signUpError } = await supabase.auth.signUp({ email: p.email, password });
      if (signUpError) {
        console.error("Auth error:", signUpError);
        setLoading(false);
        return;
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
