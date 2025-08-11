import { useState, useCallback, useMemo } from "react";
import { Search, Package, Truck, Users, CreditCard, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "conteneur" | "operation" | "client" | "facture" | "archive";
  route: string;
  icon: typeof Package;
}

// Mock data - replace with real search API
const mockSearchData: SearchResult[] = [
  { id: "1", title: "MSKU1234567", description: "Conteneur en cours de livraison", type: "conteneur", route: "/sorties", icon: Package },
  { id: "2", title: "Client ABC", description: "Armateur principal", type: "client", route: "/armateurs", icon: Users },
  { id: "3", title: "Opération #OP-2024-001", description: "Sortie urgente", type: "operation", route: "/operations", icon: Truck },
  { id: "4", title: "Facture #FAC-2024-123", description: "En attente de paiement", type: "facture", route: "/facturation", icon: CreditCard },
  { id: "5", title: "Archive Base #AB-001", description: "Stockage terminé", type: "archive", route: "/archives-base", icon: FileText },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    
    return mockSearchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.route);
    setQuery("");
    setIsOpen(false);
  }, [navigate]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conteneur": return "info";
      case "operation": return "primary";
      case "client": return "success";
      case "facture": return "warning";
      case "archive": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher conteneurs, clients, opérations..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && query.trim() && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
          <CardContent className="p-0">
            {filteredResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {filteredResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full h-auto p-3 justify-start hover:bg-muted/50"
                      onClick={() => handleSelect(result)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{result.title}</div>
                          <div className="text-xs text-muted-foreground">{result.description}</div>
                        </div>
                        <Badge variant="outline" className={`text-xs bg-${getTypeColor(result.type)}/10 text-${getTypeColor(result.type)}`}>
                          {result.type}
                        </Badge>
                      </div>
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucun résultat trouvé pour "{query}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}