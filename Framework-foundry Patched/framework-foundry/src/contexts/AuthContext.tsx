import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  name: string;
  initials: string;
  email: string;
  color: string;
  personalAgentName: string;
  avatar?: string; // URL to profile photo
}

export const PROFILES: Profile[] = [
  { name: "Abhimanyu", initials: "A", email: "abhimanyu.singh@layaa.ai", color: "#E87A2E", personalAgentName: "Arya", avatar: "/avatar-abhimanyu.jpeg" },
  { name: "Shubham", initials: "S", email: "shubham.sharma@layaa.ai", color: "#2B5797", personalAgentName: "Ananya", avatar: "/avatar-shubham.png" },
];

// Default passwords for first-time setup (users can change in settings)
const DEFAULT_PASSWORDS: Record<string, string> = {
  "abhimanyu.singh@layaa.ai": "ab.abhi",
  "shubham.sharma@layaa.ai": "sh.shub",
};

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (profile: Profile, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthState | null>(null);

// Password validation — checks against defaults first, then localStorage overrides
function getStoredPassword(email: string): string {
  // Always check user-set password first (from Settings > Change Password)
  const userSet = localStorage.getItem(`layaa_pwd_custom_${email}`);
  if (userSet) return userSet;
  // Fall back to defaults
  return DEFAULT_PASSWORDS[email] || "ab.abhi";
}

function setStoredPassword(email: string, password: string): void {
  localStorage.setItem(`layaa_pwd_custom_${email}`, password);
}

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
      if (u) {
        setUser(u);
        const p = PROFILES.find((p) => p.email === u.email) ?? null;
        setProfile(p);
        setLoading(false);
      } else {
        // Check for local session (fallback when Supabase auth is unavailable)
        const savedProfile = localStorage.getItem("layaa_active_profile");
        const savedUser = localStorage.getItem("layaa_active_user");
        if (savedProfile && savedUser) {
          try {
            setProfile(JSON.parse(savedProfile));
            setUser(JSON.parse(savedUser));
          } catch { /* invalid stored data */ }
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (p: Profile, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    // If password protection is enabled for this profile, validate it
    const customPwd = localStorage.getItem(`layaa_pwd_custom_${p.email}`);
    if (customPwd && password !== customPwd) {
      setLoading(false);
      return { success: false, error: "Incorrect password" };
    }

    // Try Supabase auth (best effort — if it fails, we still proceed with local session)
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(`layaa-os:${p.email}:2024`);
      const hashBuf = await crypto.subtle.digest("SHA-256", data);
      const hashArr = Array.from(new Uint8Array(hashBuf));
      const supabasePassword = "L!" + hashArr.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 30);

      const { error } = await supabase.auth.signInWithPassword({ email: p.email, password: supabasePassword });
      if (error) {
        const { error: signUpError } = await supabase.auth.signUp({ email: p.email, password: supabasePassword });
        if (signUpError) {
          console.log("Supabase auth unavailable, using local session:", signUpError.message);
        }
      }
    } catch (e) {
      console.log("Supabase auth skipped:", e);
    }

    // Always proceed with local session — store profile in localStorage
    const localUser = { id: p.email.split("@")[0] + "-local", email: p.email };
    localStorage.setItem("layaa_active_profile", JSON.stringify(p));
    localStorage.setItem("layaa_active_user", JSON.stringify(localUser));
    setUser(localUser as any);
    setProfile(p);
    setLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    localStorage.removeItem("layaa_active_profile");
    localStorage.removeItem("layaa_active_user");
    setUser(null);
    setProfile(null);
    try { await supabase.auth.signOut(); } catch { /* ignore */ }
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!profile) return { success: false, error: "No profile selected" };
    if (!newPassword || newPassword.length < 4) return { success: false, error: "Password must be at least 4 characters" };
    setStoredPassword(profile.email, newPassword);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
