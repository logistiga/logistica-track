import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailHistory, EmailConfig } from "@/types/notifications";
import { EmailStats } from "@/components/emails/EmailStats";
import { EmailHistoryTable } from "@/components/emails/EmailHistoryTable";
import { EmailConfigCard } from "@/components/emails/EmailConfigCard";

export default function Emails() {
  const [emailHistory] = useState<EmailHistory[]>([
    {
      id: "1",
      destinataire: "client@abc.com",
      sujet: "Alerte: Conteneur CONT001 en retard",
      dateEnvoi: "2024-01-15T14:35:00",
      statut: "envoye",
      template: "Retard de conteneur"
    },
    {
      id: "2",
      destinataire: "admin@logistica.com",
      sujet: "Opération validée - ORD-2024-001",
      dateEnvoi: "2024-01-15T12:20:00",
      statut: "envoye",
      template: "Validation opération"
    },
    {
      id: "3",
      destinataire: "client@xyz.com",
      sujet: "Facture générée - FACT-2024-001",
      dateEnvoi: "2024-01-15T10:05:00",
      statut: "echec",
      template: "Génération facture"
    }
  ]);

  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    expediteurDefaut: "notifications@logistica.com",
    serveurSMTP: "smtp.gmail.com",
    port: 587,
    ssl: true
  });

  const handleUpdateConfig = (newConfig: EmailConfig) => {
    setEmailConfig(newConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">E-mails</h1>
        <p className="text-muted-foreground">
          Gestion des notifications par e-mail et configuration SMTP
        </p>
      </div>

      <EmailStats emailHistory={emailHistory} />

      <Tabs defaultValue="historique" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="historique">
          <EmailHistoryTable emailHistory={emailHistory} />
        </TabsContent>

        <TabsContent value="configuration">
          <div className="max-w-md">
            <EmailConfigCard
              config={emailConfig}
              onUpdate={handleUpdateConfig}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}