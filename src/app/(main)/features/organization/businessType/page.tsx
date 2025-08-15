"use client";
import React, { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/section-heading";
import { BusinessTypeWithId } from "@/app/(main)/features/organization/businessType/types/business-type";
import { Card } from "@/components/ui/card";
import {
  createBusinessType,
  deleteBusinessType,
  getAllBusinessTypes,
  updateBusinessType,
} from "@/app/(main)/features/organization/businessType/services/business-type-api";
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
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { useYupForm } from "@/lib/hooks/use-yup-form";
import { businessTypeSchema } from "@/lib/schemas/business-type.schema";
import { InferType } from "yup";
import { DataTable } from "@/lib/data-table";
import { columns } from "@/app/(main)/features/organization/businessType/types/columns";
import { getContentMaxWidth } from "@/lib/layout-utils";
import { useSidebar } from "@/components/ui/sidebar";
import { debounce } from "next/dist/server/utils";

type BusinessTypeFormData = InferType<typeof businessTypeSchema>;

const BusinessTypePage: React.FC = () => {
  const { state: sidebarState } = useSidebar();
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [saving, setSaving] = useState(false);
  const contentWidthClass = getContentMaxWidth(sidebarState || "expanded");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useYupForm(businessTypeSchema, {
    defaultValues: editingId ? { name: "", description: "", id: editingId } : undefined,
  });

  const fetchBusinessTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBusinessTypes();
      setBusinessTypes(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch business types";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBusinessTypes();
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (editingId) {
      const businessType = businessTypes.find((item) => item.id === editingId);
      if (businessType) {
        reset({ name: businessType.name, description: businessType.description || "", id: businessType.id });
      }
    } else {
      reset({ name: "", description: "", id: undefined });
    }
  }, [editingId, businessTypes, reset]);

  const handleEdit = (item: BusinessTypeWithId) => {
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleDelete = debounce(async (item: BusinessTypeWithId) => {
    try {
      await deleteBusinessType(item.id);
      setBusinessTypes((prev) => prev.filter((bt) => bt.id !== item.id));
      toast.success("Business type deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete business type";
      toast.error(errorMessage);
    }
  }, 300);

  const handleSubmitForm = debounce(async (data: BusinessTypeFormData) => {
    setSaving(true);
    try {
      if (editingId) {
        await updateBusinessType({ id: editingId, name: data.name, description: data.description });
      } else {
        await createBusinessType({ name: data.name, description: data.description });
      }
      await fetchBusinessTypes();
      setDialogOpen(false);
      setEditingId(null);
      reset({ name: "", description: "", id: undefined });
      toast.success(editingId ? "Business type updated successfully" : "Business type created successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save business type";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, 300);

  if (loading) {
    return (
      <div className="mx-auto space-y-6">
        <SectionHeading title="Business Type Management" />
        <Card>
          <div className="p-4 text-center">Loading business types...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <SectionHeading title="Business Type Management" />
        <Card>
          <div className="p-4 text-center text-red-500">{error}</div>
          <Button onClick={fetchBusinessTypes} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${contentWidthClass} space-y-6`}>
      <div className="flex items-center justify-between pb-2">
        <SectionHeading title="Business Type Management" />
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingId(null);
              reset({ name: "", description: "", id: undefined });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex h-8 w-40 items-center space-x-2 text-xs font-semibold">
              Add Business Type <CirclePlus />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <DialogHeader>
                <DialogTitle className="text-lg">{editingId ? "Edit Business Type" : "Add Business Type"}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Update the business type details. Click save when you're done."
                    : "Enter new business type details. Click save when you're done."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} placeholder="Enter business type name" disabled={saving} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter description"
                    disabled={saving}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
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
        <DataTable<BusinessTypeWithId>
          columns={columns}
          data={businessTypes}
          dataSize={`${businessTypes.length} items`}
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

export default BusinessTypePage;
