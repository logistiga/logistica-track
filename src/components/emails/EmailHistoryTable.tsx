import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmailHistory } from "@/types/notifications";

interface EmailHistoryTableProps {
  emailHistory: EmailHistory[];
}

export function EmailHistoryTable({ emailHistory }: EmailHistoryTableProps) {
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "envoye":
        return <Badge variant="default" className="bg-green-500">Envoyé</Badge>;
      case "echec":
        return <Badge variant="destructive">Échec</Badge>;
      case "en-attente":
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const formatDate = (dateEnvoi: string) => {
    return new Date(dateEnvoi).toLocaleString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des e-mails</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destinataire</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Date d'envoi</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emailHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucun e-mail dans l'historique
                </TableCell>
              </TableRow>
            ) : (
              emailHistory.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="font-medium">{email.destinataire}</TableCell>
                  <TableCell>{email.sujet}</TableCell>
                  <TableCell>{email.template}</TableCell>
                  <TableCell>{formatDate(email.dateEnvoi)}</TableCell>
                  <TableCell>{getStatusBadge(email.statut)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}