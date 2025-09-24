"use client";

import React, { useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role, Permission } from "@/app/(main)/features/access_control/types/role";
import RoleForm from "@/app/(main)/features/access_control/components/role-form";
import RoleCard from "@/app/(main)/features/access_control/components/role-card";

interface RolesTabProps {
  roles: Role[];
  permissions: Permission[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: number) => void;
  onSubmitRole: (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">, roleId?: number) => void;
}

const RolesTab: React.FC<RolesTabProps> = ({ roles, permissions, onEditRole, onDeleteRole, onSubmitRole }) => {
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  }, [roles, roleSearchTerm]);

  const handleEditClick = (role: Role) => {
    setEditingRole(role);
    setCreatingRole(true);
    onEditRole(role);
  };

  const handleCancel = () => {
    setCreatingRole(false);
    setEditingRole(null);
  };

  const handleSubmit = (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    onSubmitRole(roleData, editingRole?.id);
    setCreatingRole(false);
    setEditingRole(null);
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
              disabled={creatingRole}
            />
          </div>
          <Button
            onClick={() => {
              if (creatingRole) setEditingRole(null);
              setCreatingRole(!creatingRole);
            }}
          >
            {creatingRole ? (
              <>
                <X className="mr-2 h-4 w-4" /> Close
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Role
              </>
            )}
          </Button>
        </div>
      </div>

      {creatingRole && (
        <RoleForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingRole ?? undefined}
          permission={permissions}
        />
      )}

      {!creatingRole && (
        <>
          {filteredRoles.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No roles found</h3>
              <p className="text-muted-foreground">
                {roleSearchTerm ? "Try adjusting your search terms." : "Create your first role to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoles.map((role) => (
                <RoleCard key={role.id} role={role} onEdit={handleEditClick} onDelete={onDeleteRole} />
              ))}
            </div>
          )}
        </>
      )}
    </TabsContent>
  );
};

export default RolesTab;
