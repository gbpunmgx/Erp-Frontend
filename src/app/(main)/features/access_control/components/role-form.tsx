"use client";

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import FeatureActionService from "@/app/(main)/features/access_control/services/feature-action-service";
import { Permission, Role } from "@/app/(main)/features/access_control/types/role";
import { capitalizeFeatureName, capitalizePermissionName } from "@/utils/string-utils";

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">, roleId?: number) => void;
  onCancel: () => void;
}

export default function RoleForm({ initialData, onSubmit, onCancel }: RoleFormProps) {
  const [roleName, setRoleName] = useState(initialData?.name ?? "");
  const [roleDescription, setRoleDescription] = useState(initialData?.description ?? "");
  const [permissions, setPermissions] = useState<{ group: string; items: Permission[] }[]>([]);
  const [currentPermissions, setCurrentPermissions] = useState<number[]>(initialData?.featureActionIds ?? []);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const isFormValid = useMemo(() => roleName.trim().length > 0, [roleName]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response: Permission[] = await FeatureActionService.getAll();
        const grouped = Object.values(
          response.reduce((acc: Record<string, { group: string; items: Permission[] }>, perm) => {
            if (!acc[perm.featureName]) acc[perm.featureName] = { group: perm.featureName, items: [] };
            acc[perm.featureName].items.push(perm);
            return acc;
          }, {}),
        );
        setPermissions(grouped);
      } catch (err) {
        console.error("Failed to fetch permissions", err);
      }
    };
    fetchPermissions();
  }, []);

  const togglePermission = (permId: number) => {
    setCurrentPermissions((prev) => (prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]));
  };

  const toggleGroupPermissions = (groupItems: Permission[], checked: boolean) => {
    const groupIds = groupItems.map((p) => p.id);
    setCurrentPermissions((prev) =>
      checked ? Array.from(new Set([...prev, ...groupIds])) : prev.filter((p) => !groupIds.includes(p)),
    );
  };

  const filteredPermissions = useMemo(() => {
    if (!permissionSearchTerm) return permissions;
    return permissions
      .map((group) => ({
        ...group,
        items: group.items.filter((perm) => perm.name.toLowerCase().includes(permissionSearchTerm.toLowerCase())),
      }))
      .filter((group) => group.items.length > 0);
  }, [permissions, permissionSearchTerm]);

  const allFilteredSelected = useMemo(() => {
    const allPerms = filteredPermissions.flatMap((g) => g.items);
    return allPerms.length > 0 && allPerms.every((p) => currentPermissions.includes(p.id));
  }, [filteredPermissions, currentPermissions]);

  const toggleAllFiltered = (checked: boolean) => {
    const filteredIds = filteredPermissions.flatMap((g) => g.items).map((p) => p.id);
    setCurrentPermissions((prev) =>
      checked ? Array.from(new Set([...prev, ...filteredIds])) : prev.filter((p) => !filteredIds.includes(p)),
    );
  };

  const toggleAllSections = () => {
    setOpenSections(openSections.length === permissions.length ? [] : permissions.map((g) => g.group));
  };

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

      <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <Input
          type="text"
          placeholder="Search permissions..."
          value={permissionSearchTerm}
          onChange={(e) => setPermissionSearchTerm(e.target.value)}
          className="w-full sm:w-64"
          aria-label="Search permissions"
        />
        <div className="flex items-center space-x-2">
          <Switch
            checked={allFilteredSelected}
            onCheckedChange={toggleAllFiltered}
            aria-label="Select all filtered permissions"
          />
          <Label>Select All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={openSections.length === permissions.length}
            onCheckedChange={toggleAllSections}
            aria-label="Expand or collapse all sections"
          />
          <Label>{openSections.length === permissions.length ? "Collapse All" : "Expand All"}</Label>
        </div>
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="p-8">
        {filteredPermissions.map((group) => {
          const grantedCount = group.items.filter((p) => currentPermissions.includes(p.id)).length;
          const groupAllSelected = group.items.every((p) => currentPermissions.includes(p.id));
          return (
            <AccordionItem key={group.group} value={group.group}>
              <AccordionTrigger className="hover:no-underline">
                <div className="mr-4 flex w-full items-center justify-between">
                  <span>{capitalizeFeatureName(group.group)}</span>
                  <Badge variant="secondary">
                    {grantedCount}/{group.items.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-2 flex justify-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={groupAllSelected}
                      onCheckedChange={(checked) => toggleGroupPermissions(group.items, checked)}
                      aria-label={`Select all permissions in ${capitalizeFeatureName(group.group)}`}
                    />
                    <Label>Select All</Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {group.items.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between rounded-lg border p-2">
                      <Label>{capitalizePermissionName(perm.name)}</Label>
                      <Switch
                        checked={currentPermissions.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                        aria-label={`Toggle permission ${capitalizePermissionName(perm.name)}`}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

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
