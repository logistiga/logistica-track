import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, CalendarDays, DollarSign, Building } from "lucide-react";
import { SortieFormData } from "@/types/sortie-conteneur";
import { useState, useEffect } from "react";

interface SortieFormProps {
  formData: SortieFormData;
  setFormData: (data: SortieFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

// Mock data - ces données viendraient des autres pages
const armateurs = [
  { code: "CMA20", nom: "CMA-CGM", typeConteneur: "20' sec", joursGratuits: 2, prixParJour: 10000 },
  { code: "CMA40", nom: "CMA-CGM", typeConteneur: "40' sec", joursGratuits: 2, prixParJour: 20000 },
  { code: "MSK20", nom: "MAERSK", typeConteneur: "20' sec", joursGratuits: 5, prixParJour: 11800 },
];

const camions = [
  { id: "1", numeroParc: "TR 37", immatriculation: "TR 37", statut: "disponible" },
  { id: "2", numeroParc: "TR 41", immatriculation: "TR 41", statut: "disponible" },
  { id: "3", numeroParc: "tr 08", immatriculation: "tr 08", statut: "disponible" },
];

const remorques = [
  { id: "1", numeroParc: "R 01", immatriculation: "R01", statut: "disponible" },
  { id: "2", numeroParc: "R 02", immatriculation: "R02", statut: "disponible" },
];

export const SortieForm = ({ formData, setFormData, onSubmit, onCancel }: SortieFormProps) => {
  const [selectedArmateur, setSelectedArmateur] = useState<any>(null);
  const [joursCalcules, setJoursCalcules] = useState<number>(0);

  // Calcul automatique des jours lors du changement de date
  useEffect(() => {
    if (formData.dateFinFranchise) {
      const dateFin = new Date(formData.dateFinFranchise);
      const dateAujourdhui = new Date();
      const diffTime = dateFin.getTime() - dateAujourdhui.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setJoursCalcules(Math.max(0, diffDays));
    }
  }, [formData.dateFinFranchise]);

  // Mise à jour des informations armateur
  useEffect(() => {
    const armateur = armateurs.find(a => a.code === formData.codeArmateur);
    setSelectedArmateur(armateur);
    if (armateur && formData.typeDestination === "detention") {
      setFormData({ ...formData, joursBAT: armateur.joursGratuits.toString() });
    }
  }, [formData.codeArmateur, formData.typeDestination]);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Informations conteneur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Informations sur le conteneur
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="numeroConteneur">Numéro de conteneur *</Label>
            <Input
              id="numeroConteneur"
              value={formData.numeroConteneur}
              onChange={(e) => setFormData({ ...formData, numeroConteneur: e.target.value })}
              placeholder="Ex: TCLU5234567"
              required
            />
          </div>
          <div>
            <Label htmlFor="numeroBL">Numéro de BL *</Label>
            <Input
              id="numeroBL"
              value={formData.numeroBL}
              onChange={(e) => setFormData({ ...formData, numeroBL: e.target.value })}
              placeholder="Ex: BL001234"
              required
            />
          </div>
          <div>
            <Label htmlFor="codeArmateur">Code armateur *</Label>
            <Select value={formData.codeArmateur} onValueChange={(value) => setFormData({ ...formData, codeArmateur: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un armateur" />
              </SelectTrigger>
              <SelectContent>
                {armateurs.map((armateur) => (
                  <SelectItem key={armateur.code} value={armateur.code}>
                    {armateur.code} - {armateur.nom} ({armateur.typeConteneur})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transport et destination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Transport et destination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="camion">Numéro de camion *</Label>
              <Select value={formData.camion} onValueChange={(value) => setFormData({ ...formData, camion: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un camion" />
                </SelectTrigger>
                <SelectContent>
                  {camions.filter(c => c.statut === "disponible").map((camion) => (
                    <SelectItem key={camion.id} value={camion.id}>
                      {camion.numeroParc} - {camion.immatriculation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="remorque">Numéro de remorque *</Label>
              <Select value={formData.remorque} onValueChange={(value) => setFormData({ ...formData, remorque: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une remorque" />
                </SelectTrigger>
                <SelectContent>
                  {remorques.filter(r => r.statut === "disponible").map((remorque) => (
                    <SelectItem key={remorque.id} value={remorque.id}>
                      {remorque.numeroParc} - {remorque.immatriculation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="primeChauffeur">Prime chauffeur (FCFA)</Label>
              <Input
                id="primeChauffeur"
                type="number"
                value={formData.primeChauffeur}
                onChange={(e) => setFormData({ ...formData, primeChauffeur: e.target.value })}
                placeholder="Ex: 25000"
              />
            </div>
            <div>
              <Label htmlFor="nomClient">Nom du client *</Label>
              <Input
                id="nomClient"
                value={formData.nomClient}
                onChange={(e) => setFormData({ ...formData, nomClient: e.target.value })}
                placeholder="Ex: CFAO Motors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination">Destination *</Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">La base</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.destination === "client" && (
              <div>
                <Label htmlFor="adresseClient">Adresse du client *</Label>
                <Textarea
                  id="adresseClient"
                  value={formData.adresseClient}
                  onChange={(e) => setFormData({ ...formData, adresseClient: e.target.value })}
                  placeholder="Adresse complète du client"
                  className="min-h-[80px]"
                  required
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Type de destination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Type de destination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="typeDestination">Type de destination *</Label>
            <Select value={formData.typeDestination} onValueChange={(value) => setFormData({ ...formData, typeDestination: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bat">BAT (Bon à Transférer)</SelectItem>
                <SelectItem value="detention">Détention fixe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.typeDestination === "bat" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="joursBAT">Nombre de jours BAT</Label>
                <Input
                  id="joursBAT"
                  type="number"
                  value={formData.joursBAT}
                  onChange={(e) => setFormData({ ...formData, joursBAT: e.target.value })}
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <Label htmlFor="dateFinFranchise">Date de fin de franchise</Label>
                <Input
                  id="dateFinFranchise"
                  type="date"
                  value={formData.dateFinFranchise}
                  onChange={(e) => setFormData({ ...formData, dateFinFranchise: e.target.value })}
                />
                {joursCalcules > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Durée calculée: {joursCalcules} jours hors port
                  </p>
                )}
              </div>
            </div>
          )}

          {formData.typeDestination === "detention" && selectedArmateur && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Informations de franchise automatiques</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Jours gratuits:</span>
                  <span className="ml-2 font-medium">{selectedArmateur.joursGratuits} jours</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prix par jour:</span>
                  <span className="ml-2 font-medium">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(selectedArmateur.prixParJour)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autres informations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Autres informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="nomTransitaire">Nom du transitaire *</Label>
            <Input
              id="nomTransitaire"
              value={formData.nomTransitaire}
              onChange={(e) => setFormData({ ...formData, nomTransitaire: e.target.value })}
              placeholder="Ex: BOLLORE LOGISTICS"
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer la sortie
        </Button>
      </div>
    </form>
  );
};