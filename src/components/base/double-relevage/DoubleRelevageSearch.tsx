import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoubleRelevageSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function DoubleRelevageSearch({ searchTerm, onSearchChange }: DoubleRelevageSearchProps) {
  return (
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Rechercher une opération..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}