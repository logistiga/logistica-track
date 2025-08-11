import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

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

interface UserTableProps {
  users: User[];
  roles: Role[];
  onDeleteUser: (id: string) => void;
}

export function UserTable({ users, roles, onDeleteUser }: UserTableProps) {
  const getRoleBadge = (roleName: string) => {
    const role = roles.find(r => r.nom === roleName);
    if (!role) return <Badge variant="secondary">{roleName}</Badge>;
    
    const colorClasses = {
      violet: "bg-violet-500 text-white",
      orange: "bg-orange-500 text-white",
      gray: "bg-gray-500 text-white",
      blue: "bg-blue-500 text-white",
      yellow: "bg-yellow-500 text-black",
      purple: "bg-purple-500 text-white",
    };

    return (
      <Badge className={colorClasses[role.couleur as keyof typeof colorClasses] || "bg-gray-500 text-white"}>
        {roleName}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.nom}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getRoleBadge(user.role)}</TableCell>
            <TableCell>{user.dateCreation}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}