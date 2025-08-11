import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Package, AlertTriangle, Euro } from "lucide-react";
import { ArchiveSortie } from "@/types/archivesSortie";

interface ArchiveSortieStatsProps {
  archives: ArchiveSortie[];
}

export function ArchiveSortieStats({ archives }: ArchiveSortieStatsProps) {
  const avecDetention = archives.filter(a => a.joursDepassement > 0);
  const sansDetention = archives.filter(a => a.joursDepassement === 0);
  const montantTotalDetention = archives.reduce((acc, a) => acc + (a.montantTotalDetention || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total sorties</CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{archives.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sans détention</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sansDetention.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avec détention</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avecDetention.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant détention</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{montantTotalDetention.toFixed(2)} €</div>
        </CardContent>
      </Card>
    </div>
  );
}