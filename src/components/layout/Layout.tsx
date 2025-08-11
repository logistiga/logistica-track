import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-6">
            <GlobalSearch />
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}