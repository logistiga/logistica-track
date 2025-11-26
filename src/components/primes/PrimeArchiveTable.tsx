import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import type { PrimeArchive } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";

interface PrimeArchiveTableProps {
  archives: PrimeArchive[];
  stats: any;
}

export function PrimeArchiveTable({ archives, stats }: PrimeArchiveTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArchives = archives.filter((archive) =>
    archive.numero_conteneur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.chauffeur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.numero_semaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    archive.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Archives des primes payées</CardTitle>
            {stats && (
              <p className="text-sm text-muted-foreground mt-1">
                Total payé: {stats.montant_total} ({stats.total_archives} primes)
              </p>
            )}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Conteneur</TableHead>
              <TableHead>Camion</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date Sortie</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Semaine</TableHead>
              <TableHead>Date Paiement</TableHead>
              <TableHead>Payé par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArchives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  Aucune archive trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredArchives.map((archive) => (
                <TableRow key={archive.id}>
                  <TableCell className="font-medium">{archive.numero_conteneur}</TableCell>
                  <TableCell>{archive.camion}</TableCell>
                  <TableCell>{archive.chauffeur || 'N/A'}</TableCell>
                  <TableCell>{archive.nom_client}</TableCell>
                  <TableCell>{new Date(archive.date_sortie).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatCurrency(archive.montant_prime)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                      {archive.numero_semaine}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(archive.date_paiement).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{archive.paye_par}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
