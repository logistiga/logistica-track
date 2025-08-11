import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, CalendarDays, DollarSign, Building } from "lucide-react";
import { SortieFormData } from "@/types/sortie-conteneur";
import { useState, useEffect } from "react";
import { useArmateurs } from "@/hooks/useArmateurs";
import { useVehicules } from "@/hooks/useVehicules";
import { calculateDaysFromDate } from "@/utils/sortieUtils";

interface SortieFormProps {
  formData: SortieFormData;
  setFormData: (data: SortieFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SortieForm = ({ formData, setFormData, onSubmit, onCancel }: SortieFormProps) => {
  const { armateurs, getArmateurByCode, getArmateurById, getArmateurOptions } = useArmateurs();
  const { getCamionOptions, getRemorqueOptions } = useVehicules();
  const [selectedArmateur, setSelectedArmateur] = useState<any>(null);
  const [joursCalcules, setJoursCalcules] = useState<number>(0);

  // Calcul automatique des jours lors du changement de date
  useEffect(() => {
    if (formData.dateFinFranchise) {
      const jours = calculateDaysFromDate(formData.dateFinFranchise);
      setJoursCalcules(jours);
    }
  }, [formData.dateFinFranchise]);

  // Mise à jour des informations armateur
  useEffect(() => {
    const armateurId = parseInt(formData.codeArmateur);
    const armateur = getArmateurById(armateurId);
    setSelectedArmateur(armateur);
    // Note: joursGratuits ne fait plus partie du modèle armateur - à supprimer ou gérer différemment
  }, [formData.codeArmateur, formData.typeDestination, getArmateurById]);

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
                {getArmateurOptions().map((armateur) => (
                  <SelectItem key={armateur.value} value={armateur.value}>
                    {armateur.label}
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
                  {getCamionOptions().map((camion) => (
                    <SelectItem key={camion.value} value={camion.value}>
                      {camion.label}
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
                  {getRemorqueOptions().map((remorque) => (
                    <SelectItem key={remorque.value} value={remorque.value}>
                      {remorque.label}
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
                <SelectItem value="bad">BAD (Bon À Délivrer)</SelectItem>
                <SelectItem value="detention">Détention fixe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.typeDestination === "bad" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="joursBAD">Nombre de jours BAD</Label>
                <Input
                  id="joursBAD"
                  type="number"
                  value={formData.joursBAD}
                  onChange={(e) => setFormData({ ...formData, joursBAD: e.target.value })}
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
              <h4 className="font-medium mb-2">Informations armateur</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Code:</span>
                  <span className="ml-2 font-medium">{selectedArmateur.code}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="ml-2 font-medium">{selectedArmateur.nom}</span>
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