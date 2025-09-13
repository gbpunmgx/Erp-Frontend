import React, { useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, Search, Shield, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
  isDefault?: boolean;
}

const initialPermissions = [
  "View Users",
  "Edit Users",
  "Delete Users",
  "View Roles",
  "Edit Roles",
  "Delete Roles",
  "View Billing",
  "Edit Billing",
  "Access Reports",
];

// Dummy roles
const dummyRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access and control",
    permissions: initialPermissions,
    color: "bg-red-500",
    userCount: 2,
  },
  {
    id: "2",
    name: "Admin",
    description: "Administrative access with some restrictions",
    permissions: initialPermissions.slice(0, 6),
    color: "bg-blue-500",
    userCount: 5,
  },
  {
    id: "3",
    name: "Editor",
    description: "Content management and editing capabilities",
    permissions: [initialPermissions[0], initialPermissions[2], initialPermissions[3], initialPermissions[8]],
    color: "bg-green-500",
    userCount: 12,
    isDefault: true,
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to content",
    permissions: [initialPermissions[0], initialPermissions[2], initialPermissions[6]],
    color: "bg-gray-500",
    userCount: 25,
  },
  {
    id: "5",
    name: "Billing Manager",
    description: "Manages billing and financial operations",
    permissions: [initialPermissions[0], initialPermissions[6], initialPermissions[7]],
    color: "bg-purple-500",
    userCount: 3,
  },
];

const RolesTab: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(dummyRoles);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  }, [roles, roleSearchTerm]);

  const handleEditRole = (role: Role) => {
    alert(`Edit role: ${role.name}`);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
  };

  const createNewRole = () => {
    const newRole: Role = {
      id: String(roles.length + 1),
      name: `New Role ${roles.length + 1}`,
      description: "New role description",
      permissions: [],
      color: "bg-blue-500",
      userCount: 0,
    };
    setRoles((prev) => [...prev, newRole]);
  };

  return (
    <TabsContent value="roles" className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold">System Roles</h2>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search roles..."
              value={roleSearchTerm}
              onChange={(e) => setRoleSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={createNewRole}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">No roles found</h3>
          <p className="text-muted-foreground">
            {roleSearchTerm ? "Try adjusting your search terms." : "Create your first role to get started."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${role.color}`}></div>
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    {role.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{role.description}</CardDescription>
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <span>{role.permissions.length} permissions</span>
                  <span>{role.userCount} users</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default RolesTab;
