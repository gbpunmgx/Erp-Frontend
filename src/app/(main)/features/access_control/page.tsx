"use client";

import React, { useEffect, useState } from "react";
import { Shield, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import RolesTab from "@/app/(main)/features/access_control/components/roles";
import { UsersTableDemo } from "@/app/(main)/features/access_control/components/users";

import type { User } from "@/app/(main)/features/access_control/types/user";
import type { Permission, Role } from "@/app/(main)/features/access_control/types/role";

import UserService from "@/app/(main)/features/access_control/services/user-service";
import RoleService from "@/app/(main)/features/access_control/services/role-service";
import FeatureActionService from "@/app/(main)/features/access_control/services/feature-action-service";
import { toast } from "sonner";

const RoleManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (err) {
      toast.error("Failed to fetch roles. Please try again.");
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const data = await FeatureActionService.getAll();
      setPermissions(data);
    } catch (err) {
      toast.error("Failed to fetch permissions. Please try again.");
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers().then((r) => {});
    fetchRoles().then((r) => {});
    fetchPermissions().then((r) => {});
  }, []);

  const handleEditRole = (role: Role) => {
    toast("Edit role feature coming soon!");
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await RoleService.delete(roleId);
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
      toast.success("Role deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete role. Please try again.");
    }
  };

  const handleSubmitRole = async (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">, roleId?: number) => {
    try {
      if (roleId) {
        const updatedRole = await RoleService.update(roleId, roleData);
        setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
        toast.success("Role updated successfully.");
      } else {
        const newRole = await RoleService.create(roleData);
        setRoles((prev) => [...prev, newRole]);
        toast.success("Role created successfully.");
      }
    } catch (err) {
      toast.error("Failed to submit role. Please try again.");
    }
  };

  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const updatedUser = {
        ...user,
        roleId,
        updatedAt: new Date().toISOString(),
      };

      await UserService.update(userId, updatedUser);
      toast.success("Role assigned successfully.");
      await fetchUsers();
      await fetchRoles();
      await fetchPermissions();
    } catch (err) {
      toast.error("Failed to assign role. Please try again.");
    }
  };

  return (
    <Card className="p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Shield className="text-primary h-8 w-8" />
          <span>Role Management System</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage user roles, permissions, and access control</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Roles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          {rolesLoading || permissionsLoading ? (
            <p className="text-muted-foreground text-sm">Loading roles & permissions...</p>
          ) : (
            <RolesTab
              roles={roles}
              permissions={permissions}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
              onSubmitRole={handleSubmitRole}
            />
          )}
        </TabsContent>

        <TabsContent value="users">
          {usersLoading ? (
            <p className="text-muted-foreground text-sm">Loading users...</p>
          ) : (
            <UsersTableDemo
              users={users}
              roles={roles}
              onUpdateUser={async (updatedUser) => {
                if (!updatedUser.roleId) return;
                await handleAssignRole(updatedUser.id, updatedUser.roleId);
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoleManagementSystem;
