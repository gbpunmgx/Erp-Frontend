"use client";
import React, { useEffect, useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Role } from "@/app/(main)/features/access_control/types/role";
import RoleService from "@/app/(main)/features/access_control/services/role-service";
import RoleForm from "@/app/(main)/features/access_control/components/role-form";
import RoleCard from "@/app/(main)/features/access_control/components/role-card";

const RolesTab: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await RoleService.getAll();
        setRoles(res);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles().then((r) => {});
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  }, [roles, roleSearchTerm]);

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setCreatingRole(true);
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await RoleService.delete(roleId);
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const handleSubmitRole = async (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">, roleId?: number) => {
    try {
      if (roleId) {
        const updatedRole = await RoleService.update(roleId, roleData);
        setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
      } else {
        const newRole = await RoleService.create(roleData);
        setRoles((prev) => [...prev, newRole]);
      }
      setCreatingRole(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Failed to submit role:", error);
    }
  };

  if (loading) {
    return (
      <TabsContent value="roles" className="p-12 text-center">
        <p>Loading roles...</p>
      </TabsContent>
    );
  }

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
          onSubmit={handleSubmitRole}
          onCancel={() => {
            setCreatingRole(false);
            setEditingRole(null);
          }}
          initialData={editingRole ?? undefined}
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
              {filteredRoles.map((role, index) => (
                <RoleCard key={`${role.id}-${index}`} role={role} onEdit={handleEditRole} onDelete={handleDeleteRole} />
              ))}
            </div>
          )}
        </>
      )}
    </TabsContent>
  );
};

export default RolesTab;
