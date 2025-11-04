"use client";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/common/TabletCommon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shapes } from "lucide-react";
import React, { useState } from "react";
import { AssetCategory, assetCategoryColumns } from "./componets/asset-columns";

const AssetTypeManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    branchId: "",
  });

  const branches = [
    { id: "1", name: "Main Branch" },
    { id: "2", name: "Secondary Branch" },
    { id: "3", name: "Regional Office" },
  ];

  const [assetTypes, setAssetTypes] = useState<AssetCategory[]>([
    {
      id: "1",
      name: "Computer Hardware",
      description: "Desktop computers, laptops, monitors, and peripherals",
      active: true,
      deleted: false,
      branch: { id: "1", name: "Main Branch" },
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Office Furniture",
      description: "Desks, chairs, cabinets, and other furniture items",
      active: true,
      deleted: false,
      branch: { id: "1", name: "Main Branch" },
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10",
    },
    {
      id: "3",
      name: "Vehicles",
      description: "Company cars, trucks, and other transportation assets",
      active: false,
      deleted: false,
      branch: { id: "2", name: "Secondary Branch" },
      createdAt: "2024-03-05",
      updatedAt: "2024-03-20",
    },
  ]);

  const handleOpenDialog = (item?: AssetCategory) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        active: item.active,
        branchId: item.branch.id,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        active: true,
        branchId: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setAssetTypes(
        assetTypes.map((type) =>
          type.id === editingItem.id
            ? {
                ...type,
                ...formData,
                branch: branches.find((b) => b.id === formData.branchId)!,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : type,
        ),
      );
    } else {
      const newAssetType: AssetCategory = {
        id: String(assetTypes.length + 1),
        ...formData,
        deleted: false,
        branch: branches.find((b) => b.id === formData.branchId)!,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setAssetTypes([...assetTypes, newAssetType]);
    }
    handleCloseDialog();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Manage Assets"
        description="View, add, and manage your assets efficiently"
        icon={Shapes}
        actionLabel="Add Asset Type"
        onActionClick={() => handleOpenDialog()}
      />
      <div className="overflow-x-auto">
        <DataTable<AssetCategory> data={assetTypes} columns={assetCategoryColumns} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Asset Type" : "Create New Asset Type"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the asset type information below."
                : "Add a new asset type category to your system."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Computer Hardware"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this asset type..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.branchId}
                  onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default AssetTypeManager;
