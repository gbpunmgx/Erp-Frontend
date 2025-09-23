// barcode.tsx
"use client";
import React, { useCallback, useState } from "react";
import { Barcode as BarcodeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenericReport } from "@/components/common/GenericReport/generic-report";
import { ColumnDef } from "@/components/common/GenericReport/types";
import { FormProps } from "@/components/common/GenericReport/generic-form";

// Generate mock barcodes
const generateMockBarcodes = (): Array<{
  id: number;
  code: string;
  product: string;
  status: string;
  createdAt: string;
}> => {
  const statuses = ["Active", "Inactive", "Expired"] as const;
  const products = [
    "Wireless Mouse",
    "USB-C Cable",
    "Bluetooth Speaker",
    "Gaming Keyboard",
    "Laptop Stand",
    "Phone Case",
    "Headphones",
    "Power Bank",
    "Screen Protector",
    "USB Drive",
    "Webcam",
    "External SSD",
    "Mouse Pad",
    "Laptop Sleeve",
    "HDMI Cable",
    "Wireless Charger",
    "Smart Watch",
    "Fitness Tracker",
    "Gaming Headset",
    "Mechanical Keyboard",
    "Monitor Stand",
    "Docking Station",
    "Travel Adapter",
    "Memory Card",
    "Bluetooth Adapter",
  ];

  const barcodes: Array<{
    id: number;
    code: string;
    product: string;
    status: string;
    createdAt: string;
  }> = [];

  for (let i = 1; i <= 4000; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const code = `BAR${String(i).padStart(6, "0")}`;

    barcodes.push({
      id: i,
      code,
      product: `${randomProduct} ${String(i)}`,
      status: randomStatus,
      createdAt: createdDate.toISOString().split("T")[0],
    });
  }

  return barcodes;
};

const mockBarcodes = generateMockBarcodes();

const BarcodeColumns: ColumnDef[] = [
  { id: "id", accessorKey: "id", header: "ID", sortable: true, filterable: true },
  { id: "code", accessorKey: "code", header: "Barcode", sortable: true, filterable: true },
  {
    id: "product",
    accessorKey: "product",
    header: "Product",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <span className="max-w-xs truncate" title={value}>
        {value}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <Badge
        className={
          value === "Active"
            ? "bg-green-100 text-green-800"
            : value === "Inactive"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        }
      >
        {value}
      </Badge>
    ),
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
      { value: "Expired", label: "Expired" },
    ],
  },
  { id: "createdAt", accessorKey: "createdAt", header: "Created", sortable: true, filterable: true },
];

const BarcodeForm: React.FC<FormProps> = ({ item, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    code: item?.code ?? "",
    product: item?.product ?? "",
    status: item?.status ?? "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{item ? "Edit Barcode" : "Add New Barcode"}</DialogTitle>
        <DialogDescription>
          {item ? "Update the barcode information" : "Create a new barcode for your product"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Barcode</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Enter barcode"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Input
            id="product"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{item ? "Update" : "Create"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const BarcodeManagement: React.FC = () => {
  const stats = [
    { label: "Total Barcodes", value: mockBarcodes.length },
    { label: "Active", value: mockBarcodes.filter((b) => b.status === "Active").length, color: "text-green-600" },
    {
      label: "Inactive/Expired",
      value: mockBarcodes.filter((b) => b.status !== "Active").length,
      color: "text-red-600",
    },
  ];

  const handleAddBarcode = useCallback((data: { code: string; product: string; status: string }) => {
    console.log("Add barcode:", data);
    // Implement add logic here
  }, []);

  return (
    <GenericReport
      title="Barcode Management"
      data={mockBarcodes}
      columns={BarcodeColumns}
      icon={<BarcodeIcon className="text-primary h-6 w-6" />}
      onSubmitAdd={handleAddBarcode}
      stats={stats}
      FormComponent={BarcodeForm}
    />
  );
};

export default BarcodeManagement;
