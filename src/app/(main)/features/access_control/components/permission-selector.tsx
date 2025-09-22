"use client";

import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Permission } from "@/app/(main)/features/access_control/types/role";
import { capitalizeFeatureName, capitalizePermissionName } from "@/utils/string-utils";

interface PermissionSelectorProps {
  permissions: Permission[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
}

export default function PermissionSelector({ permissions, selectedIds, onChange }: PermissionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, { group: string; items: Permission[] }> = {};
    permissions.forEach((perm) => {
      if (!grouped[perm.featureName]) grouped[perm.featureName] = { group: perm.featureName, items: [] };
      grouped[perm.featureName].items.push(perm);
    });
    return Object.values(grouped);
  }, [permissions]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedPermissions;
    return groupedPermissions
      .map((g) => ({
        ...g,
        items: g.items.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
      }))
      .filter((g) => g.items.length > 0);
  }, [groupedPermissions, searchTerm]);

  const togglePermission = (permId: number) => {
    if (selectedIds.includes(permId)) {
      onChange(selectedIds.filter((id) => id !== permId));
    } else {
      onChange([...selectedIds, permId]);
    }
  };

  const toggleGroupPermissions = (groupItems: Permission[], checked: boolean) => {
    const groupIds = groupItems.map((p) => p.id);
    if (checked) {
      onChange(Array.from(new Set([...selectedIds, ...groupIds])));
    } else {
      onChange(selectedIds.filter((id) => !groupIds.includes(id)));
    }
  };

  const allFilteredSelected = useMemo(() => {
    const allPerms = filteredGroups.flatMap((g) => g.items);
    return allPerms.length > 0 && allPerms.every((p) => selectedIds.includes(p.id));
  }, [filteredGroups, selectedIds]);

  const toggleAllFiltered = (checked: boolean) => {
    const filteredIds = filteredGroups.flatMap((g) => g.items).map((p) => p.id);
    if (checked) {
      onChange(Array.from(new Set([...selectedIds, ...filteredIds])));
    } else {
      onChange(selectedIds.filter((id) => !filteredIds.includes(id)));
    }
  };

  const toggleAllSections = () => {
    setOpenSections(openSections.length === groupedPermissions.length ? [] : groupedPermissions.map((g) => g.group));
  };

  return (
    <div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <Input
          type="text"
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex items-center space-x-2">
          <Switch checked={allFilteredSelected} onCheckedChange={toggleAllFiltered} />
          <Label>Select All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={openSections.length === groupedPermissions.length} onCheckedChange={toggleAllSections} />
          <Label>{openSections.length === groupedPermissions.length ? "Collapse All" : "Expand All"}</Label>
        </div>
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="p-4">
        {filteredGroups.map((group) => {
          const grantedCount = group.items.filter((p) => selectedIds.includes(p.id)).length;
          const groupAllSelected = group.items.every((p) => selectedIds.includes(p.id));
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
                    />
                    <Label>Select All</Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {group.items.map((perm) => (
                    <div key={perm.id} className="flex items-center justify-between rounded-lg border p-2">
                      <Label>{capitalizePermissionName(perm.name)}</Label>
                      <Switch
                        checked={selectedIds.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
