import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SortieConteneur, SortieFormData, ReturnData } from "@/types/sortie-conteneur";
import { SortieForm } from "@/components/sortie-conteneur/SortieForm";
import { SortieTable } from "@/components/sortie-conteneur/SortieTable";
import { ReturnDialog } from "@/components/sortie-conteneur/ReturnDialog";

const SortieConteneurPage = () => {
  const { toast } = useToast();
  const [sorties, setSorties] = useState<SortieConteneur[]>([
    {
      id: "1",
      numeroConteneur: "TCLU5234567",
      numeroVL: "VL001",
      codeArmateur: "ARM001",
      camion: "CAM001",
      remorque: "REM001",
      nomClient: "Client A",
      destination: "client",
      adresseClient: "123 Rue Example",
      typeDestination: "detention",
      nomTransitaire: "Trans A",
      dateSortie: "2024-01-15",
      statut: "en_cours"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState<SortieConteneur | null>(null);
  const [activeTab, setActiveTab] = useState("nouvelle");

  const [formData, setFormData] = useState<SortieFormData>({
    numeroConteneur: "",
    numeroVL: "",
    codeArmateur: "",
    camion: "",
    remorque: "",
    nomClient: "",
    destination: "",
    adresseClient: "",
    typeDestination: "",
    joursBAT: "",
    dateFinFranchise: "",
    nomTransitaire: ""
  });

  const [returnData, setReturnData] = useState<ReturnData>({
    dateRetour: "",
    camionRetour: "",
    remorqueRetour: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nouvelleSortie: SortieConteneur = {
      id: Date.now().toString(),
      numeroConteneur: formData.numeroConteneur,
      numeroVL: formData.numeroVL,
      codeArmateur: formData.codeArmateur,
      camion: formData.camion,
      remorque: formData.remorque,
      nomClient: formData.nomClient,
      destination: formData.destination as "base" | "client",
      adresseClient: formData.adresseClient,
      typeDestination: formData.typeDestination as "bat" | "detention",
      joursBAT: formData.joursBAT ? parseInt(formData.joursBAT) : undefined,
      dateFinFranchise: formData.dateFinFranchise,
      nomTransitaire: formData.nomTransitaire,
      dateSortie: new Date().toISOString().split('T')[0],
      statut: formData.destination === "base" ? "a_la_base" : "livre_client"
    };

    setSorties([...sorties, nouvelleSortie]);
    setFormData({
      numeroConteneur: "",
      numeroVL: "",
      codeArmateur: "",
      camion: "",
      remorque: "",
      nomClient: "",
      destination: "",
      adresseClient: "",
      typeDestination: "",
      joursBAT: "",
      dateFinFranchise: "",
      nomTransitaire: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Sortie ajoutée",
      description: "La nouvelle sortie de conteneur a été enregistrée."
    });
  };

  const handleConfirmReturn = () => {
    if (selectedSortie) {
      setSorties(sorties.map(s => 
        s.id === selectedSortie.id 
          ? { ...s, dateRetour: returnData.dateRetour, statut: "retourne_port" as const }
          : s
      ));
      setIsReturnDialogOpen(false);
      setSelectedSortie(null);
      setReturnData({ dateRetour: "", camionRetour: "", remorqueRetour: "" });
      
      toast({
        title: "Retour confirmé",
        description: "Le retour au port a été enregistré."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sortie de Conteneur</h1>
          <p className="text-muted-foreground">
            Gérez les sorties et le suivi des conteneurs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une nouvelle sortie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle sortie de conteneur</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle sortie de conteneur du port
              </DialogDescription>
            </DialogHeader>
            <SortieForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nouvelle">Sorties en cours</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nouvelle" className="space-y-4">
          <SortieTable
            sorties={sorties}
            showHistory={false}
            onReturnClick={(sortie) => {
              setSelectedSortie(sortie);
              setIsReturnDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="historique" className="space-y-4">
          <SortieTable sorties={sorties} showHistory={true} />
        </TabsContent>
      </Tabs>

      <ReturnDialog
        isOpen={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        selectedSortie={selectedSortie}
        returnData={returnData}
        setReturnData={setReturnData}
        onConfirmReturn={handleConfirmReturn}
      />
    </div>
  );
};

export default SortieConteneurPage;