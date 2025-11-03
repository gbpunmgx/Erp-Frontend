"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

import { DataTable } from "@/components/common/TabletCommon";
import { Card } from "@/components/ui/card";

import { columns as userColumns } from "@/app/(main)/features/access_control/columns/user-columns";
import UserService from "@/app/(main)/features/access_control/services/user-service";
import { Role } from "@/app/(main)/features/access_control/types/role";
import { User } from "@/app/(main)/features/access_control/types/user";

interface UsersTableProps {
  users: User[];
  roles: Role[];
  onUpdateUser: (updatedUser: User) => void;
}

export function UsersTable({ users, roles, onUpdateUser }: UsersTableProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<number | null>(null);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    const userToUpdate = users.find((u) => u.id === selectedUser);
    if (!userToUpdate) return;

    const updatedUser: User = {
      ...userToUpdate,
      roleId: selectedRole,
      updatedAt: new Date().toISOString(),
    };

    try {
      await UserService.update(selectedUser, updatedUser);
      onUpdateUser(updatedUser);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to assign role:", error);
    }
  };

  return (
    <div>
      {/* <div className="flex items-center gap-4 py-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Assign Role</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <Select value={selectedUser?.toString() ?? ""} onValueChange={(val) => setSelectedUser(Number(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole?.toString() ?? ""} onValueChange={(val) => setSelectedRole(Number(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleAssignRole}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div> */}

      <div className="overflow-x-auto">
        <DataTable<User>
          data={users}
          columns={userColumns}
          pageSizeOptions={[5, 10, 20]}
          initialPage={1}
          initialPageSize={10}
        />
      </div>
    </div>
  );
}
