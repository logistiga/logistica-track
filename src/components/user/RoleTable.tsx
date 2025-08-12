import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Role {
  id: string;
  nom: string;
  description: string;
  permissions: number;
  couleur: string;
}

interface RoleTableProps {
  roles: Role[];
  onDeleteRole: (id: string) => void;
}

export function RoleTable({ roles, onDeleteRole }: RoleTableProps) {
  const getRiskBadge = (permissions: number) => {
    if (permissions >= 30) {
      return <Badge variant="destructive">Critique</Badge>;
    } else if (permissions >= 15) {
      return <Badge className="bg-warning text-warning-foreground">Moyen</Badge>;
    } else {
      return <Badge className="bg-success text-success-foreground">Faible</Badge>;
    }
  };

  const getRoleBadge = (role: Role) => {
    const colorClasses = {
      violet: "bg-violet-500 text-white",
      orange: "bg-warning text-warning-foreground",
      gray: "bg-muted text-muted-foreground",
      blue: "bg-primary text-primary-foreground",
      yellow: "bg-accent text-accent-foreground",
      purple: "bg-secondary text-secondary-foreground",
    };

    return (
      <Badge className={colorClasses[role.couleur as keyof typeof colorClasses] || "bg-muted text-muted-foreground"}>
        {role.nom}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom du Rôle</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Niveau de Risque</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell>{getRoleBadge(role)}</TableCell>
            <TableCell>{role.description}</TableCell>
            <TableCell className="font-medium">{role.permissions}</TableCell>
            <TableCell>{getRiskBadge(role.permissions)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteRole(role.id)}
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