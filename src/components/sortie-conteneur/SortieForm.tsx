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
import { useState, useEffect } from "react";
import { useArmateurs } from "@/hooks/useArmateurs";
import { useVehicules } from "@/hooks/useVehicules";
import { calculateDaysFromDate } from "@/utils/sortieUtils";
import { VehicleCombobox } from "@/components/ui/vehicle-combobox";
import { CostSummary } from "./CostSummary";
import { DetentionSummary } from "./DetentionSummary";
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
  const { armateurs, getArmateurByCode, getArmateurById, getArmateurOptions } = useArmateurs();
  const { getCamionOptions, getRemorqueOptions } = useVehicules();
  const [selectedArmateur, setSelectedArmateur] = useState<any>(null);
  const [joursCalcules, setJoursCalcules] = useState<number>(0);
  const [dateSortie, setDateSortie] = useState<Date | undefined>(
    formData.dateSortie ? new Date(formData.dateSortie) : new Date()
  );

  // Calcul automatique des jours lors du changement de date
  useEffect(() => {
    if (formData.dateFinFranchise) {
      const jours = calculateDaysFromDate(formData.dateFinFranchise);
      setJoursCalcules(jours);
    }
  }, [formData.dateFinFranchise]);

  // Synchroniser la date de sortie avec le formData
  useEffect(() => {
    if (dateSortie) {
      const dateString = format(dateSortie, "yyyy-MM-dd");
      setFormData({ ...formData, dateSortie: dateString });
    }
  }, [dateSortie]);

  // Mise à jour des informations armateur
  useEffect(() => {
    if (formData.codeArmateur) {
      const armateur = getArmateurByCode(formData.codeArmateur);
      setSelectedArmateur(armateur);
    } else {
      setSelectedArmateur(null);
    }
  }, [formData.codeArmateur, formData.typeDestination, getArmateurByCode]);

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
              placeholder="Ex: BL001"
              required
            />
          </div>
          <div>
            <Label htmlFor="codeArmateur">Armateur *</Label>
            <Select value={formData.codeArmateur} onValueChange={(value) => setFormData({ ...formData, codeArmateur: value })}>
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
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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
            <Select value={formData.destination} onValueChange={(value) => setFormData({ ...formData, destination: value })}>
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
            <Select value={formData.typeDestination} onValueChange={(value) => setFormData({ ...formData, typeDestination: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bad">BAD (Bon A Délivrer)</SelectItem>
                <SelectItem value="detention">Détention fixe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.typeDestination === "bad" && (
            <div className="space-y-4">
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
                    min={formData.dateSortie || format(new Date(), "yyyy-MM-dd")}
                  />
                  {joursCalcules > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Durée calculée: {joursCalcules} jours hors port
                    </p>
                  )}
                  {formData.dateFinFranchise && formData.dateSortie && 
                   new Date(formData.dateFinFranchise) <= new Date(formData.dateSortie) && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ La date de fin de franchise doit être après la date de sortie
                    </p>
                  )}
                </div>
              </div>

              {/* Récapitulatif des conditions armateur pour BAD */}
              {selectedArmateur && (
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium mb-2">Conditions de détention - {selectedArmateur.code}</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-primary">{selectedArmateur.jours_gratuits}</div>
                      <div className="text-sm text-muted-foreground">Jours gratuits</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-destructive">{selectedArmateur.prix_par_jour.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">FCFA / jour</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-orange-600">
                        {(() => {
                          if (dateSortie && selectedArmateur.jours_gratuits) {
                            const dateLimite = new Date(dateSortie);
                            dateLimite.setDate(dateLimite.getDate() + selectedArmateur.jours_gratuits);
                            return format(dateLimite, "dd/MM", { locale: fr });
                          }
                          return "--";
                        })()}
                      </div>
                      <div className="text-sm text-muted-foreground">Date limite retour</div>
                    </div>
                  </div>

                  {dateSortie && selectedArmateur.jours_gratuits && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex items-center gap-2 text-orange-700">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">
                          Le conteneur doit être retourné au port avant le{" "}
                          {(() => {
                            const dateLimite = new Date(dateSortie);
                            dateLimite.setDate(dateLimite.getDate() + selectedArmateur.jours_gratuits);
                            return format(dateLimite, "dd MMMM yyyy", { locale: fr });
                          })()}
                        </span>
                      </div>
                      
                      {(() => {
                        // Utiliser la date de fin de franchise si fournie, sinon calculer automatiquement
                        const dateLimite = formData.dateFinFranchise 
                          ? new Date(formData.dateFinFranchise)
                          : (() => {
                              const date = new Date(dateSortie);
                              date.setDate(date.getDate() + selectedArmateur.jours_gratuits);
                              return date;
                            })();
                        
                        const today = new Date();
                        const diffTime = dateLimite.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        // Calculer les jours de détention si date de fin de franchise fournie
                        const detentionDays = formData.dateFinFranchise 
                          ? Math.max(0, Math.ceil((today.getTime() - dateLimite.getTime()) / (1000 * 60 * 60 * 24)))
                          : Math.max(0, Math.abs(diffDays));
                        
                        if (diffDays < 0) {
                          return (
                            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                              ⚠️ <strong>RETARD:</strong> {Math.abs(diffDays)} jour(s) de retard
                              <br />
                              Coût détention: {(detentionDays * selectedArmateur.prix_par_jour).toLocaleString()} FCFA
                              {formData.dateFinFranchise && (
                                <div className="mt-1 text-xs">
                                  📅 Basé sur la date de fin de franchise: {format(dateLimite, "dd/MM/yyyy", { locale: fr })}
                                </div>
                              )}
                            </div>
                          );
                        } else if (diffDays === 0) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                              🟡 <strong>ATTENTION:</strong> Dernier jour de franchise
                              {formData.dateFinFranchise && (
                                <div className="mt-1 text-xs">
                                  📅 Date de fin personnalisée: {format(dateLimite, "dd/MM/yyyy", { locale: fr })}
                                </div>
                              )}
                            </div>
                          );
                        } else if (diffDays <= 2) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                              ⏰ <strong>URGENT:</strong> Plus que {diffDays} jour(s) avant détention
                              {formData.dateFinFranchise && (
                                <div className="mt-1 text-xs">
                                  📅 Date de fin personnalisée: {format(dateLimite, "dd/MM/yyyy", { locale: fr })}
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                              ✅ <strong>OK:</strong> Encore {diffDays} jour(s) de franchise
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {formData.typeDestination === "detention" && (
            <div className="space-y-4">
              <DetentionSummary armateurId={selectedArmateur?.id || null} />
              
              {selectedArmateur && (
                <div className="p-4 bg-muted rounded-lg space-y-4">
                  <h4 className="font-medium mb-2">Conditions de détention - {selectedArmateur.code}</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-primary">{selectedArmateur.jours_gratuits}</div>
                      <div className="text-sm text-muted-foreground">Jours gratuits</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-destructive">{selectedArmateur.prix_par_jour.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">FCFA / jour</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded border">
                      <div className="text-2xl font-bold text-orange-600">
                        {(() => {
                          if (dateSortie && selectedArmateur.jours_gratuits) {
                            const dateLimite = new Date(dateSortie);
                            dateLimite.setDate(dateLimite.getDate() + selectedArmateur.jours_gratuits);
                            return format(dateLimite, "dd/MM", { locale: fr });
                          }
                          return "--";
                        })()}
                      </div>
                      <div className="text-sm text-muted-foreground">Date limite retour</div>
                    </div>
                  </div>

                  {dateSortie && selectedArmateur.jours_gratuits && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex items-center gap-2 text-orange-700">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">
                          Le conteneur doit être retourné au port avant le{" "}
                          {(() => {
                            const dateLimite = new Date(dateSortie);
                            dateLimite.setDate(dateLimite.getDate() + selectedArmateur.jours_gratuits);
                            return format(dateLimite, "dd MMMM yyyy", { locale: fr });
                          })()}
                        </span>
                      </div>
                      
                      {(() => {
                        const dateLimite = new Date(dateSortie);
                        dateLimite.setDate(dateLimite.getDate() + selectedArmateur.jours_gratuits);
                        const today = new Date();
                        const diffTime = dateLimite.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays < 0) {
                          return (
                            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                              ⚠️ <strong>RETARD:</strong> {Math.abs(diffDays)} jour(s) de retard
                              <br />
                              Coût détention: {(Math.abs(diffDays) * selectedArmateur.prix_par_jour).toLocaleString()} FCFA
                            </div>
                          );
                        } else if (diffDays === 0) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                              🟡 <strong>ATTENTION:</strong> Dernier jour de franchise
                            </div>
                          );
                        } else if (diffDays <= 2) {
                          return (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                              ⏰ <strong>URGENT:</strong> Plus que {diffDays} jour(s) avant détention
                            </div>
                          );
                        } else {
                          return (
                            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                              ✅ <strong>OK:</strong> Encore {diffDays} jour(s) de franchise
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
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