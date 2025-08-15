"use client";

import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Car, CirclePlus } from "lucide-react";
import { useConfirm } from "@/components/common/confirm-provider";
import { toast } from "sonner";
import { useYupForm } from "@/lib/hooks/use-yup-form";
import { InferType } from "yup";
import { ConfirmType } from "@/config/confirm-dialog.config";
import { OrganizationBase, OrganizationWithId } from "@/app/(main)/features/organization/all/types/organization-type";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  updateOrganization,
} from "@/app/(main)/features/organization/all/services/organization-type-api";
import { organizationSchema } from "@/lib/schemas/organization.schema";
import { getAllBusinessTypes } from "@/app/(main)/features/organization/businessType/services/business-type-api";
import { BusinessTypeWithId } from "@/app/(main)/features/organization/businessType/types/business-type";
import { DataTable } from "@/lib/data-table";
import { columns } from "@/app/(main)/features/organization/all/types/columns";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { getContentMaxWidth } from "@/lib/layout-utils";

type OrganizationFormData = InferType<typeof organizationSchema>;

const OrganizationPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationWithId[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  const { state: sidebarState } = useSidebar();
  const contentWidthClass = getContentMaxWidth(sidebarState || "expanded");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useYupForm(organizationSchema, {
    defaultValues: undefined,
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to fetch organizations";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const data = await getAllBusinessTypes();
      setBusinessTypes(data);
    } catch (error) {
      toast.error("Failed to fetch business types");
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    if (editingId !== null) {
      const org = organizations.find((o) => o.id === editingId);
      if (org) {
        reset({
          name: org.name,
          code: org.code,
          phoneNo: org.phoneNo,
          address: org.address,
          panNo: org.panNo,
          establishDate: org.establishDate,
          active: org.active,
          logo: org.logo,
          businessType: org.businessType.id,
        });
      }
    } else {
      reset({});
    }
  }, [editingId, organizations, reset]);

  const handleEdit = (item: OrganizationWithId) => {
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleDelete = async (item: OrganizationWithId) => {
    const confirmed = await confirm(ConfirmType.Delete);
    if (confirmed) {
      try {
        await deleteOrganization(item.id);
        setOrganizations((prev) => prev.filter((org) => org.id !== item.id));
        toast.success("Organization deleted successfully");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to delete organization";
        toast.error(msg);
      }
    } else {
      toast.error("Deletion cancelled");
    }
  };

  const handleSubmitForm = async (data: OrganizationFormData) => {
    setSaving(true);
    try {
      if (editingId !== null) {
        await updateOrganization({
          id: editingId,
          ...data,
          businessType: { id: data.businessType } as any,
        } as OrganizationWithId);
      } else {
        await createOrganization({
          ...data,
          businessType: { id: data.businessType } as any,
        } as OrganizationBase);
      }
      await fetchOrganizations();
      setDialogOpen(false);
      setEditingId(null);
      reset({});
      toast.success(editingId ? "Organization updated successfully" : "Organization created successfully");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save organization";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${contentWidthClass} space-y-6`}>
      <div className="flex items-center justify-between pb-2">
        <SectionHeading title="Organization Management" />
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingId(null);
              reset({});
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex h-8 w-48 items-center space-x-2 text-xs font-semibold">
              Add Organization <CirclePlus />
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-4xl" style={{ maxWidth: "56rem", width: "90vw" }}>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Organization" : "Add Organization"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update organization details. Click save when done."
                    : "Enter new organization details. Click save when done."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Name and Code in one row */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} disabled={saving} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" {...register("code")} disabled={saving} />
                    {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
                  </div>
                </div>

                {/* Phone No and Address in one row */}
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="phoneNo">Phone No</Label>
                    <Input id="phoneNo" {...register("phoneNo")} disabled={saving} />
                    {errors.phoneNo && <p className="text-sm text-red-500">{errors.phoneNo.message}</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} disabled={saving} />
                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="panNo">PAN No (optional)</Label>
                    <Input id="panNo" {...register("panNo")} disabled={saving} />
                    {errors.panNo && <p className="text-sm text-red-500">{errors.panNo.message}</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="establishDate">Establish Date (optional)</Label>
                    <Input type="date" id="establishDate" {...register("establishDate")} disabled={saving} />
                    {errors.establishDate && <p className="text-sm text-red-500">{errors.establishDate.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="logo">Logo URL (optional)</Label>
                    <Input id="logo" {...register("logo")} disabled={saving} />
                    {errors.logo && <p className="text-sm text-red-500">{errors.logo.message}</p>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="businessType">Business Type</Label>
                    <select
                      id="businessType"
                      {...register("businessType")}
                      disabled={saving}
                      className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select business type
                      </option>
                      {businessTypes.map((bt) => (
                        <option key={bt.id} value={bt.id}>
                          {bt.name}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && <p className="text-sm text-red-500">{errors.businessType.message}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    {...register("active")}
                    disabled={saving}
                    className="h-4 w-4 rounded border border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-6">
        <DataTable<OrganizationWithId>
          columns={columns}
          data={organizations}
          dataSize={`${organizations.length} items`}
          showDataSize={true}
          showActionsColumn={true}
          actionsColumnWidth="120px"
          filterOptions={{
            active: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ],
          }}
          bulkActions={{
            onBulkDelete: (rows) => console.log("Delete selected:", rows),
          }}
          actionsConfig={{
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      </Card>
    </div>
  );
};

export default OrganizationPage;
