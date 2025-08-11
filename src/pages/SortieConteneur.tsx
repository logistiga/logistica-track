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
      numeroBL: "BL001234",
      codeArmateur: "CMA20",
      camion: "1",
      remorque: "1",
      primeChauffeur: 25000,
      nomClient: "CFAO Motors",
      destination: "client",
      adresseClient: "Zone Industrielle, Abidjan",
      typeDestination: "detention",
      nomTransitaire: "BOLLORE LOGISTICS",
      dateSortie: "2024-01-15",
      statut: "en_cours"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedSortie, setSelectedSortie] = useState<SortieConteneur | null>(null);
  const [editingSortie, setEditingSortie] = useState<SortieConteneur | null>(null);
  const [activeTab, setActiveTab] = useState("nouvelle");

  const [formData, setFormData] = useState<SortieFormData>({
    numeroConteneur: "",
    numeroBL: "",
    codeArmateur: "",
    camion: "",
    remorque: "",
    primeChauffeur: "",
    nomClient: "",
    destination: "",
    adresseClient: "",
    typeDestination: "",
    joursBAD: "",
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
    
    if (editingSortie) {
      // Mode modification
      const sortieModifiee: SortieConteneur = {
        ...editingSortie,
        numeroConteneur: formData.numeroConteneur,
        numeroBL: formData.numeroBL,
        codeArmateur: formData.codeArmateur,
        camion: formData.camion,
        remorque: formData.remorque,
        primeChauffeur: formData.primeChauffeur ? parseInt(formData.primeChauffeur) : 0,
        nomClient: formData.nomClient,
        destination: formData.destination as "base" | "client",
        adresseClient: formData.adresseClient,
        typeDestination: formData.typeDestination as "bad" | "detention",
        joursBAD: formData.joursBAD ? parseInt(formData.joursBAD) : undefined,
        dateFinFranchise: formData.dateFinFranchise,
        nomTransitaire: formData.nomTransitaire,
      };

      setSorties(sorties.map(s => s.id === editingSortie.id ? sortieModifiee : s));
      setEditingSortie(null);
      
      toast({
        title: "Sortie modifiée",
        description: "Les modifications ont été enregistrées."
      });
    } else {
      // Mode création
      const nouvelleSortie: SortieConteneur = {
        id: Date.now().toString(),
        numeroConteneur: formData.numeroConteneur,
        numeroBL: formData.numeroBL,
        codeArmateur: formData.codeArmateur,
        camion: formData.camion,
        remorque: formData.remorque,
        primeChauffeur: formData.primeChauffeur ? parseInt(formData.primeChauffeur) : 0,
        nomClient: formData.nomClient,
        destination: formData.destination as "base" | "client",
        adresseClient: formData.adresseClient,
        typeDestination: formData.typeDestination as "bad" | "detention",
        joursBAD: formData.joursBAD ? parseInt(formData.joursBAD) : undefined,
        dateFinFranchise: formData.dateFinFranchise,
        nomTransitaire: formData.nomTransitaire,
        dateSortie: new Date().toISOString().split('T')[0],
        statut: formData.destination === "base" ? "a_la_base" : "livre_client"
      };

      setSorties([...sorties, nouvelleSortie]);
      
      toast({
        title: "Sortie ajoutée",
        description: "La nouvelle sortie de conteneur a été enregistrée."
      });
    }

    // Reset form
    setFormData({
      numeroConteneur: "",
      numeroBL: "",
      codeArmateur: "",
      camion: "",
      remorque: "",
      primeChauffeur: "",
      nomClient: "",
      destination: "",
      adresseClient: "",
      typeDestination: "",
      joursBAD: "",
      dateFinFranchise: "",
      nomTransitaire: ""
    });
    setIsAddDialogOpen(false);
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

  const handleEdit = (sortie: SortieConteneur) => {
    setEditingSortie(sortie);
    setFormData({
      numeroConteneur: sortie.numeroConteneur,
      numeroBL: sortie.numeroBL,
      codeArmateur: sortie.codeArmateur,
      camion: sortie.camion,
      remorque: sortie.remorque,
      primeChauffeur: sortie.primeChauffeur.toString(),
      nomClient: sortie.nomClient,
      destination: sortie.destination,
      adresseClient: sortie.adresseClient || "",
      typeDestination: sortie.typeDestination,
      joursBAD: sortie.joursBAD?.toString() || "",
      dateFinFranchise: sortie.dateFinFranchise || "",
      nomTransitaire: sortie.nomTransitaire
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (sortie: SortieConteneur) => {
    setSorties(sorties.filter(s => s.id !== sortie.id));
    toast({
      title: "Sortie supprimée",
      description: "La sortie de conteneur a été supprimée."
    });
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
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingSortie(null);
            setFormData({
              numeroConteneur: "",
              numeroBL: "",
              codeArmateur: "",
              camion: "",
              remorque: "",
              primeChauffeur: "",
              nomClient: "",
              destination: "",
              adresseClient: "",
              typeDestination: "",
              joursBAD: "",
              dateFinFranchise: "",
              nomTransitaire: ""
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une nouvelle sortie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSortie ? "Modifier la sortie de conteneur" : "Nouvelle sortie de conteneur"}
              </DialogTitle>
              <DialogDescription>
                {editingSortie 
                  ? "Modifiez les informations de la sortie de conteneur"
                  : "Enregistrez une nouvelle sortie de conteneur du port"
                }
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
            onEditClick={handleEdit}
            onReturnClick={(sortie) => {
              setSelectedSortie(sortie);
              setIsReturnDialogOpen(true);
            }}
            onDeleteClick={handleDelete}
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