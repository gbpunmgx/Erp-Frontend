"use client";

import { useState, useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Permission, Role } from "@/app/(main)/features/access_control/types/role";
import PermissionSelector from "./permission-selector";

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">, roleId?: number) => void;
  onCancel: () => void;
  permission: Permission[];
}

export default function RoleForm({ initialData, onSubmit, onCancel, permission }: RoleFormProps) {
  const [roleName, setRoleName] = useState(initialData?.name ?? "");
  const [roleDescription, setRoleDescription] = useState(initialData?.description ?? "");
  const [currentPermissions, setCurrentPermissions] = useState<number[]>(initialData?.featureActionIds ?? []);

  const isFormValid = useMemo(() => roleName.trim().length > 0, [roleName]);

  const handleSubmit = () => {
    onSubmit(
      {
        name: roleName,
        description: roleDescription,
        organizationId: 1,
        featureActionIds: currentPermissions,
        authUserIds: initialData?.authUserIds ?? [],
      },
      initialData?.id,
    );
  };

  return (
    <div>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="role-name" className="text-sm font-medium">
            Role Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="role-name"
            placeholder="Enter role name (e.g., Administrator, Editor)"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-desc" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="role-desc"
            placeholder="Describe the role's purpose and responsibilities"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            className="min-h-[100px] w-full rounded-md border-gray-300 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </CardContent>

      <PermissionSelector permissions={permission} selectedIds={currentPermissions} onChange={setCurrentPermissions} />

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {initialData ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </div>
  );
}
