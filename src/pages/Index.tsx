import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProfilePicker } from "@/components/ProfilePicker";
import { AppShell } from "@/components/layout/AppShell";

function IndexContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <ProfilePicker />;
  }

  return <AppShell />;
}

const Index = () => (
  <AuthProvider>
    <IndexContent />
  </AuthProvider>
);

export default Index;
