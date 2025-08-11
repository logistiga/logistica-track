import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  FileText, 
  Package, 
  Users, 
  AlertTriangle, 
  CreditCard, 
  Archive, 
  Mail,
  Bell,
  BarChart3,
  Menu,
  X,
  Ship,
  Building2
} from "lucide-react";

const navigation = [
  { name: "Tableau de Bord", href: "/", icon: BarChart3 },
  { name: "Sorties de Conteneur", href: "/sorties", icon: Package },
  { name: "Base", href: "/base", icon: Building2 },
  { name: "Matériel", href: "/materiel", icon: Truck },
  { name: "Armateurs", href: "/armateurs", icon: Ship },
  { name: "Détention", href: "/detention", icon: AlertTriangle },
  { name: "Facturation", href: "/facturation", icon: CreditCard },
  { name: "Opérations", href: "/operations", icon: FileText },
  { name: "Ordres", href: "/ordres", icon: Archive },
  { name: "Archives Base", href: "/archives-base", icon: Archive },
  { name: "Archives Sortie", href: "/archives-sortie", icon: Archive },
  { name: "Archives Opération", href: "/archives-operation", icon: Archive },
  { name: "Utilisateurs", href: "/utilisateurs", icon: Users },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "E-mails", href: "/emails", icon: Mail },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-to-b from-primary to-primary-dark text-primary-foreground transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Logistica</h1>
              <p className="text-xs text-primary-light">Gestion Transport</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-primary-foreground hover:bg-primary-light/20"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary-foreground text-primary shadow-md" 
                  : "text-primary-light hover:bg-primary-light/20 hover:text-primary-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-light/30">
        <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="text-sm">
              <p className="font-medium">Admin</p>
              <p className="text-xs text-primary-light">Administrateur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}