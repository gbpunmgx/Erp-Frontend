"use client";
import React, { useState } from "react";
import { Settings, Shield, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PermissionsTab from "@/app/(main)/features/access_control/components/permission";
import UsersTab, { User } from "@/app/(main)/features/access_control/components/users";
import RolesTab from "@/app/(main)/features/access_control/components/roles";

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    roles: [
      { id: "r1", name: "Admin", color: "#3b82f6" },
      { id: "r2", name: "Editor", color: "#22c55e" },
    ],
    status: "active",
    lastActive: "2025-09-13",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "",
    roles: [{ id: "r3", name: "Viewer", color: "#f59e0b" }],
    status: "pending",
    lastActive: "2025-09-10",
  },
];

const RoleManagementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "users" | "permissions">("roles");

  return (
    <Card className="bg-gray-50 p-6 p-8 dark:bg-gray-900">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Shield className="text-primary h-8 w-8" />
          <span>Role Management System</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage user roles, permissions, and access control</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab users={mockUsers} />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoleManagementSystem;
