import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, Shield, UserPlus } from "lucide-react";
import { UserTable } from "@/components/user/UserTable";
import { RoleTable } from "@/components/user/RoleTable";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
  dateCreation: string;
  statut: "actif" | "inactif";
}

interface Role {
  id: string;
  nom: string;
  description: string;
  permissions: number;
  couleur: string;
}

export default function Utilisateurs() {
  const [users, setUsers] = useState<User[]>([
    { id: "1", nom: "Youssef Alami", email: "youssef@logistica.com", role: "Chauffeur", dateCreation: "10/08/2025", statut: "actif" },
    { id: "2", nom: "Salma Fassi", email: "salma@logistica.com", role: "Administrateur", dateCreation: "10/08/2025", statut: "actif" },
    { id: "3", nom: "Omar Amraoui", email: "omar@logistica.com", role: "Super Administrateur", dateCreation: "10/08/2025", statut: "actif" },
    { id: "4", nom: "Ahmed Benali", email: "ahmed@logistica.com", role: "Manager Opérations", dateCreation: "10/08/2025", statut: "actif" },
    { id: "5", nom: "Hassan Idrissi", email: "hassan@logistica.com", role: "Opérateur", dateCreation: "10/08/2025", statut: "actif" },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: "1", nom: "Administrateur", description: "Gestion des utilisateurs et opérations", permissions: 39, couleur: "violet" },
    { id: "2", nom: "Chauffeur", description: "Consultation des missions", permissions: 5, couleur: "orange" },
    { id: "3", nom: "Lecteur", description: "Consultation uniquement", permissions: 12, couleur: "gray" },
    { id: "4", nom: "Manager Opérations", description: "Supervision des opérations logistiques", permissions: 21, couleur: "blue" },
    { id: "5", nom: "Opérateur", description: "Opérations courantes", permissions: 14, couleur: "yellow" },
    { id: "6", nom: "Super Administrateur", description: "Accès complet au système", permissions: 49, couleur: "purple" },
  ]);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nom: "", email: "", role: "", motDePasse: "" });
  const [newRole, setNewRole] = useState({ nom: "", description: "", permissions: 0, couleur: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddUser = () => {
    if (!newUser.nom || !newUser.email || !newUser.role) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      nom: newUser.nom,
      email: newUser.email,
      role: newUser.role,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      statut: "actif",
    };

    setUsers([...users, user]);
    setNewUser({ nom: "", email: "", role: "", motDePasse: "" });
    setIsAddUserDialogOpen(false);
    toast({
      title: "Succès",
      description: "Utilisateur ajouté avec succès",
    });
  };

  const handleAddRole = () => {
    if (!newRole.nom || !newRole.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      ...newRole,
    };

    setRoles([...roles, role]);
    setNewRole({ nom: "", description: "", permissions: 0, couleur: "" });
    setIsAddRoleDialogOpen(false);
    toast({
      title: "Succès",
      description: "Rôle ajouté avec succès",
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Supprimé",
      description: "Utilisateur supprimé avec succès",
    });
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
    toast({
      title: "Supprimé",
      description: "Rôle supprimé avec succès",
    });
  };

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary rounded-xl">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">Gérez les utilisateurs et leurs rôles d'accès</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher des rôles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Rôles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add User Button */}
          <div className="flex justify-end">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      value={newUser.nom}
                      onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                      placeholder="Ex: John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Ex: john@logistica.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle *</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.nom}>
                            {role.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="motDePasse">Mot de passe (optionnel)</Label>
                    <Input
                      id="motDePasse"
                      type="password"
                      value={newUser.motDePasse}
                      onChange={(e) => setNewUser({ ...newUser, motDePasse: e.target.value })}
                      placeholder="Laissez vide pour générer automatiquement"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddUser}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <UserTable 
                users={filteredUsers} 
                roles={roles} 
                onDeleteUser={handleDeleteUser} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          {/* Stats Cards for Roles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Rôles</p>
                    <p className="text-3xl font-bold text-info">{roles.length}</p>
                    <p className="text-xs text-muted-foreground">rôles configurés</p>
                  </div>
                  <div className="p-3 bg-info-light rounded-xl">
                    <Shield className="w-6 h-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rôles Admin</p>
                    <p className="text-3xl font-bold text-warning">2</p>
                    <p className="text-xs text-muted-foreground">accès privilégiés</p>
                  </div>
                  <div className="p-3 bg-warning-light rounded-xl">
                    <Shield className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modules</p>
                    <p className="text-3xl font-bold text-success">8</p>
                    <p className="text-xs text-muted-foreground">modules disponibles</p>
                  </div>
                  <div className="p-3 bg-success-light rounded-xl">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                    <p className="text-3xl font-bold text-primary">49</p>
                    <p className="text-xs text-muted-foreground">actions possibles</p>
                  </div>
                  <div className="p-3 bg-primary-light rounded-xl">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Role Button */}
          <div className="flex justify-end">
            <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Rôle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nomRole">Nom du rôle *</Label>
                    <Input
                      id="nomRole"
                      value={newRole.nom}
                      onChange={(e) => setNewRole({ ...newRole, nom: e.target.value })}
                      placeholder="Ex: Gestionnaire"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Ex: Gestion des opérations courantes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="permissions">Nombre de permissions</Label>
                    <Input
                      id="permissions"
                      type="number"
                      value={newRole.permissions}
                      onChange={(e) => setNewRole({ ...newRole, permissions: parseInt(e.target.value) || 0 })}
                      placeholder="Ex: 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="couleur">Couleur</Label>
                    <Select value={newRole.couleur} onValueChange={(value) => setNewRole({ ...newRole, couleur: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une couleur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Bleu</SelectItem>
                        <SelectItem value="green">Vert</SelectItem>
                        <SelectItem value="yellow">Jaune</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Violet</SelectItem>
                        <SelectItem value="gray">Gris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddRole}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Roles Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Liste des Rôles</CardTitle>
            </CardHeader>
            <CardContent>
              <RoleTable 
                roles={filteredRoles} 
                onDeleteRole={handleDeleteRole} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}