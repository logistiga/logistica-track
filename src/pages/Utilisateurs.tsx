import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { userService, CreateUserData } from "@/services/userService";
import { User } from "@/services/authService";

interface Role {
  id: string;
  nom: string;
  description: string;
  permissions: number;
  couleur: string;
}

export default function Utilisateurs() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier que l'utilisateur est admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <CardContent className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Seuls les administrateurs peuvent accéder à cette section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [roles] = useState<Role[]>([
    { id: "1", nom: "Administrateur", description: "Gestion des utilisateurs et opérations", permissions: 39, couleur: "violet" },
    { id: "2", nom: "Manager", description: "Supervision des opérations", permissions: 21, couleur: "blue" },
    { id: "3", nom: "Opérateur", description: "Opérations courantes", permissions: 14, couleur: "yellow" },
    { id: "4", nom: "Visiteur", description: "Consultation uniquement", permissions: 5, couleur: "gray" },
  ]);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "operator" as const,
    password: "",
    telephone: "",
    departement: ""
  });
  const [newRole, setNewRole] = useState({ nom: "", description: "", permissions: 0, couleur: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Charger les utilisateurs - Mock data pour Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Mock data for Supabase users
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Omar Amraoui",
            email: "omar@logistiga.com",
            role: "admin",
            role_label: "Administrateur",
            telephone: "+221 77 123 45 01",
            departement: "Direction",
            actif: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        setUsers(mockUsers);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les utilisateurs',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData: CreateUserData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password,
        telephone: newUser.telephone,
        departement: newUser.departement,
      };
      
      const createdUser = await userService.createUser(userData);
      setUsers([...users, createdUser]);
      setNewUser({ name: "", email: "", role: "operator", password: "", telephone: "", departement: "" });
      setIsAddUserDialogOpen(false);
      toast({
        title: 'Utilisateur créé',
        description: `${createdUser.name} a été créé avec succès.`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la création',
        variant: 'destructive',
      });
    }
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

    toast({
      title: "Info",
      description: "La gestion des rôles sera bientôt disponible",
    });
  };

  const handleDeleteUser = async (userId: string | number) => {
    try {
      await userService.deleteUser(Number(userId));
      setUsers(users.filter(user => user.id !== String(userId)));
      toast({
        title: 'Utilisateur supprimé',
        description: 'L\'utilisateur a été supprimé avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRole = (id: string) => {
    toast({
      title: "Info",
      description: "La suppression des rôles sera bientôt disponible",
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role_label || user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

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
          placeholder="Rechercher des utilisateurs..."
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
                  <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Ex: jean@logistica.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={newUser.telephone}
                      onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
                      placeholder="+221 77 123 45 67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="departement">Département</Label>
                    <Input
                      id="departement"
                      value={newUser.departement}
                      onChange={(e) => setNewUser({ ...newUser, departement: e.target.value })}
                      placeholder="Transport, Logistique, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle *</Label>
                    <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="operator">Opérateur</SelectItem>
                        <SelectItem value="viewer">Visiteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddUser}>
                      Créer l'utilisateur
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <UserTable 
                users={filteredUsers} 
                roles={roles} 
                onDeleteUser={(id) => handleDeleteUser(id)} 
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
                    <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                    <p className="text-3xl font-bold text-success">{users.filter(u => u.actif).length}</p>
                    <p className="text-xs text-muted-foreground">comptes actifs</p>
                  </div>
                  <div className="p-3 bg-success-light rounded-xl">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admins</p>
                    <p className="text-3xl font-bold text-warning">{users.filter(u => u.role === 'admin').length}</p>
                    <p className="text-xs text-muted-foreground">administrateurs</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-primary">{users.length}</p>
                    <p className="text-xs text-muted-foreground">comptes créés</p>
                  </div>
                  <div className="p-3 bg-primary-light rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roles Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rôles Système</CardTitle>
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