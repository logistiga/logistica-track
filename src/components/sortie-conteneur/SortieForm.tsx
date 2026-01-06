import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Package, Truck, CalendarDays, Building, CalendarIcon } from "lucide-react";
import { SortieFormData } from "@/types/sortie-conteneur";
import { useState, useEffect, useMemo } from "react";
import { useArmateurs } from "@/hooks/useArmateurs";
import { useVehicules } from "@/hooks/useVehicules";
import { VehicleCombobox } from "@/components/ui/vehicle-combobox";
import { CostSummary } from "./CostSummary";
import { DetentionSummary } from "./DetentionSummary";
import { ArmateurConditions } from "./ArmateurConditions";
import { DetentionAlert } from "./DetentionAlert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface SortieFormProps {
  formData: SortieFormData;
  setFormData: (data: SortieFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const SortieForm = ({ formData, setFormData, onSubmit, onCancel }: SortieFormProps) => {
  const { getArmateurByCode, getArmateurOptions } = useArmateurs();
  const { getCamionOptions, getRemorqueOptions } = useVehicules();
  
  const [dateSortie, setDateSortie] = useState<Date | undefined>(
    formData.dateSortie ? new Date(formData.dateSortie) : new Date()
  );

  // Armateur sélectionné
  const selectedArmateur = useMemo(() => {
    if (!formData.codeArmateur) return null;
    return getArmateurByCode(formData.codeArmateur);
  }, [formData.codeArmateur, getArmateurByCode]);

  // Calcul des jours gratuits
  const joursCalcules = useMemo(() => {
    if (!formData.dateFinFranchise || !dateSortie) return 0;
    
    const dateFinFranchise = new Date(formData.dateFinFranchise);
    const diffInTime = dateFinFranchise.getTime() - dateSortie.getTime();
    return Math.max(0, Math.ceil(diffInTime / (1000 * 3600 * 24)));
  }, [formData.dateFinFranchise, dateSortie]);

  // Synchroniser joursBAD avec joursCalcules
  useEffect(() => {
    if (joursCalcules > 0 && formData.joursBAD !== joursCalcules.toString()) {
      setFormData({ ...formData, joursBAD: joursCalcules.toString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joursCalcules]);

  // Synchroniser la date de sortie avec le formData
  useEffect(() => {
    if (dateSortie) {
      const dateString = format(dateSortie, "yyyy-MM-dd");
      if (formData.dateSortie !== dateString) {
        setFormData({ ...formData, dateSortie: dateString });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateSortie]);

  // Validation de date de franchise
  const isDateFinFranchiseInvalid = useMemo(() => {
    if (!formData.dateFinFranchise || !formData.dateSortie) return false;
    return new Date(formData.dateFinFranchise) <= new Date(formData.dateSortie);
  }, [formData.dateFinFranchise, formData.dateSortie]);

  const isDateFinFranchisePast = useMemo(() => {
    if (!formData.dateFinFranchise) return false;
    return new Date(formData.dateFinFranchise) <= new Date();
  }, [formData.dateFinFranchise]);

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
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="Ex: BL001"
              required
            />
          </div>
          <div>
            <Label htmlFor="codeArmateur">Armateur *</Label>
            <Select 
              value={formData.codeArmateur} 
              onValueChange={(value) => setFormData({ ...formData, codeArmateur: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un armateur" />
              </SelectTrigger>
              <SelectContent>
                {getArmateurOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camion">Camion</Label>
              <VehicleCombobox
                value={formData.camion}
                onValueChange={(value) => setFormData({ ...formData, camion: value })}
                options={getCamionOptions()}
                placeholder="Sélectionner un camion"
                emptyText="Aucun camion trouvé"
              />
            </div>
            <div>
              <Label htmlFor="remorque">Remorque</Label>
              <VehicleCombobox
                value={formData.remorque}
                onValueChange={(value) => setFormData({ ...formData, remorque: value })}
                options={getRemorqueOptions()}
                placeholder="Sélectionner une remorque"
                emptyText="Aucune remorque trouvée"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomClient">Nom du client *</Label>
              <Input
                id="nomClient"
                value={formData.nomClient}
                onChange={(e) => setFormData({ ...formData, nomClient: e.target.value })}
                placeholder="Ex: COMPANY SA"
                required
              />
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
          </div>

          <div>
            <Label htmlFor="dateSortie">Date de sortie *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateSortie && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateSortie ? format(dateSortie, "dd MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateSortie}
                  onSelect={setDateSortie}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
            <Label htmlFor="destination">Destination *</Label>
            <Select 
              value={formData.destination} 
              onValueChange={(value) => setFormData({ ...formData, destination: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base">Base</SelectItem>
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
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="typeDestination">Type de destination *</Label>
            <Select 
              value={formData.typeDestination} 
              onValueChange={(value) => setFormData({ ...formData, typeDestination: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bad">BAD (Bon A Délivrer)</SelectItem>
                <SelectItem value="detention">Détention fixe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section BAD */}
          {formData.typeDestination === "bad" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    min={formData.dateSortie || format(new Date(), "yyyy-MM-dd")}
                  />
                  {joursCalcules > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Durée calculée: {joursCalcules} jours hors port
                    </p>
                  )}
                  {isDateFinFranchiseInvalid && (
                    <p className="text-sm text-destructive mt-1">
                      ⚠️ La date de fin de franchise doit être après la date de sortie
                    </p>
                  )}
                  {isDateFinFranchisePast && !isDateFinFranchiseInvalid && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Attention: Date de fin de franchise dans le passé - calcul de détention automatique
                    </p>
                  )}
                </div>
              </div>

              {/* Conditions armateur pour BAD */}
              {selectedArmateur && dateSortie && (
                <>
                  <ArmateurConditions 
                    armateur={selectedArmateur} 
                    dateSortie={dateSortie}
                    dateFinFranchise={formData.dateFinFranchise}
                  />
                  <DetentionAlert
                    dateSortie={dateSortie}
                    joursGratuits={selectedArmateur.jours_gratuits}
                    prixParJour={selectedArmateur.prix_par_jour}
                    dateFinFranchise={formData.dateFinFranchise}
                  />
                </>
              )}
            </div>
          )}

          {/* Section Détention */}
          {formData.typeDestination === "detention" && (
            <div className="space-y-4">
              <DetentionSummary armateurId={selectedArmateur?.id?.toString() || null} />
              
              {selectedArmateur && dateSortie && (
                <>
                  <ArmateurConditions 
                    armateur={selectedArmateur} 
                    dateSortie={dateSortie}
                  />
                  <DetentionAlert
                    dateSortie={dateSortie}
                    joursGratuits={selectedArmateur.jours_gratuits}
                    prixParJour={selectedArmateur.prix_par_jour}
                  />
                </>
              )}
            </div>
          )}

          {/* Récapitulatif des coûts */}
          <CostSummary formData={formData} joursCalcules={joursCalcules} />
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

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4">
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
