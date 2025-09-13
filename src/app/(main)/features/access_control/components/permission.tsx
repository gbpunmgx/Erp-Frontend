"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const roles = [
  { name: "Admin", description: "Full system access" },
  { name: "Editor", description: "Content management" },
  { name: "Viewer", description: "Read-only access" },
];

const members = [
  { name: "Alice", avatar: "A", status: "online" },
  { name: "Bob", avatar: "B", status: "away" },
  { name: "Charlie", avatar: "C", status: "offline" },
];

const permissions = [
  {
    group: "Dashboard",
    items: [
      { name: "View", description: "View dashboard data" },
      { name: "Edit", description: "Modify dashboard settings" },
      { name: "Delete", description: "Remove dashboard items" },
    ],
  },
  {
    group: "Users",
    items: [
      { name: "View", description: "View user profiles" },
      { name: "Create", description: "Create new users" },
      { name: "Update", description: "Update user information" },
      { name: "Delete", description: "Delete users" },
    ],
  },
];

interface MemberPermission {
  member: string;
  role: string;
  granted: string[];
}

const PermissionsTab = () => {
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [memberPermissions, setMemberPermissions] = useState<MemberPermission[]>([]);

  const handleRoleChange = (member: string, role: string) => {
    setMemberPermissions((prev) => {
      const exist = prev.find((m) => m.member === member);
      if (exist) {
        return prev.map((m) => (m.member === member ? { ...m, role } : m));
      }
      return [...prev, { member, role, granted: [] }];
    });
  };

  const togglePermission = (member: string, permission: string) => {
    setMemberPermissions((prev) =>
      prev.map((m) => {
        if (m.member === member) {
          const granted = m.granted.includes(permission)
            ? m.granted.filter((p) => p !== permission)
            : [...m.granted, permission];
          return { ...m, granted };
        }
        return m;
      }),
    );
  };

  const toggleAllPermissions = (member: string, checked: boolean) => {
    const allPermissionNames = permissions.flatMap((group) => group.items.map((item) => item.name));

    setMemberPermissions((prev) =>
      prev.map((m) => {
        if (m.member === member) {
          return {
            ...m,
            granted: checked ? allPermissionNames : [],
          };
        }
        return m;
      }),
    );
  };

  const currentPermissions = memberPermissions.find((m) => m.member === selectedMember);

  const selectedMemberData = members.find((m) => m.name === selectedMember);
  const selectedRole = roles.find((r) => r.name === currentPermissions?.role);

  const allPermissionNames = permissions.flatMap((group) => group.items.map((item) => item.name));

  const allPermissionsGranted = currentPermissions?.granted.length === allPermissionNames.length;

  return (
    <TabsContent value="permissions" className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex w-full flex-col">
          <Label htmlFor="member-select" className="mb-1 text-sm">
            Select User
          </Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Choose a team member" className="text-sm">
                {selectedMember && selectedMember}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-1">
              {members.map((member) => (
                <SelectItem key={member.name} value={member.name} className="py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {member.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMember && (
          <div className="flex w-full flex-col">
            <Label htmlFor="role-select" className="mb-1 text-sm">
              Assign Role
            </Label>
            <Select
              value={currentPermissions?.role ?? ""}
              onValueChange={(role) => handleRoleChange(selectedMember, role)}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select a role" className="text-sm">
                  {currentPermissions?.role}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="p-1">
                {roles.map((role) => (
                  <SelectItem key={role.name} value={role.name} className="py-1 text-sm">
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Permissions Management */}
      {selectedMember && (
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Detailed Permissions</CardTitle>
                <CardDescription>Configure specific permissions for this user</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="select-all-permissions"
                    checked={allPermissionsGranted}
                    onCheckedChange={(checked) => toggleAllPermissions(selectedMember, checked)}
                  />
                  <Label htmlFor="select-all-permissions" className="cursor-pointer text-sm font-medium">
                    {allPermissionsGranted ? "Uncheck All" : "Check All"}
                  </Label>
                </div>
                <Badge variant="outline">{currentPermissions?.granted.length ?? 0} permissions granted</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {permissions.map((group) => {
                const filteredItems = group.items.filter((perm) =>
                  perm.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()),
                );

                if (filteredItems.length === 0) return null;

                const grantedCount = filteredItems.filter((item) =>
                  currentPermissions?.granted.includes(item.name),
                ).length;

                return (
                  <AccordionItem key={group.group} value={group.group}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="mr-4 flex w-full items-center justify-between">
                        <span className="text-left">{group.group}</span>
                        <Badge variant="secondary">
                          {grantedCount}/{filteredItems.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {group.group === "Users" && (
                          <div>
                            <div className="mb-2 flex justify-end">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`select-all-${group.group}`}
                                  checked={filteredItems.every((item) =>
                                    currentPermissions?.granted.includes(item.name),
                                  )}
                                  onCheckedChange={(checked) => {
                                    filteredItems.forEach((item) => {
                                      const isCurrentlyGranted = currentPermissions?.granted.includes(item.name);
                                      if (checked && !isCurrentlyGranted) {
                                        togglePermission(selectedMember, item.name);
                                      } else if (!checked && isCurrentlyGranted) {
                                        togglePermission(selectedMember, item.name);
                                      }
                                    });
                                  }}
                                />
                                <Label
                                  htmlFor={`select-all-${group.group}`}
                                  className="text-muted-foreground cursor-pointer text-xs"
                                >
                                  Select All
                                </Label>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              {filteredItems.map((perm) => {
                                const isGranted = currentPermissions?.granted.includes(perm.name);

                                return (
                                  <div
                                    key={perm.name}
                                    className="flex items-center justify-between rounded-lg border p-2"
                                  >
                                    <Label
                                      htmlFor={`${group.group}-${perm.name}`}
                                      className="cursor-pointer text-sm font-medium"
                                    >
                                      {perm.name}
                                    </Label>
                                    <Switch
                                      id={`${group.group}-${perm.name}`}
                                      checked={isGranted}
                                      onCheckedChange={() => togglePermission(selectedMember, perm.name)}
                                      className="ml-2"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default PermissionsTab;
