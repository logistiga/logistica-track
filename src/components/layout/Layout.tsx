import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex h-14 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="icon-only">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
              
              <div className="hidden md:block flex-1">
                <GlobalSearch />
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <NotificationCenter />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="sm:hidden icon-only"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}