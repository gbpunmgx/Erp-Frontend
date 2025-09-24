"use client";

import React, { useEffect, useState } from "react";
import { Shield, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import RolesTab from "@/app/(main)/features/access_control/components/roles";

import type { User } from "@/app/(main)/features/access_control/types/user";
import type { Permission, Role } from "@/app/(main)/features/access_control/types/role";

import UserService from "@/app/(main)/features/access_control/services/user-service";
import RoleService from "@/app/(main)/features/access_control/services/role-service";
import FeatureActionService from "@/app/(main)/features/access_control/services/feature-action-service";
import { UsersTableDemo } from "@/app/(main)/features/access_control/components/users";

const RoleManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "users" | "permissions">("roles");

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAll();
        setUsers(data);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await RoleService.getAll();
        setRoles(data);
      } catch (err) {
        console.error("❌ Failed to fetch roles:", err);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await FeatureActionService.getAll();
        setPermissions(data);
      } catch (err) {
        console.error("❌ Failed to fetch permissions:", err);
      } finally {
        setPermissionsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

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
          {(rolesLoading ?? permissionsLoading) ? (
            <p className="text-muted-foreground text-sm">Loading roles & permissions...</p>
          ) : (
            <RolesTab initialRoles={roles} initialPermissions={permissions} />
          )}
        </TabsContent>

        <TabsContent value="users">
          {usersLoading ? (
            <p className="text-muted-foreground text-sm">Loading users...</p>
          ) : (
            <UsersTableDemo users={users} roles={roles} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoleManagementSystem;
