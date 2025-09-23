"use client";
import React, { useCallback, useState } from "react";
import { Package as PackageIcon, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { GenericReport } from "@/components/common/GenericReport/generic-report";
import { ColumnDef } from "@/components/common/GenericReport/types";
import { FormProps } from "@/components/common/GenericReport/generic-form";

// Generate mock batches data
const generateMockBatches = (): Array<{
  id: number;
  batchNumber: string;
  product: string;
  manufactureDate: string;
  expiryDate: string;
  status: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  origination: string;
  branch: string;
}> => {
  const statuses = ["Active", "Expired", "Recalled", "Pending"] as const;
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
  const creators = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Lee", "Robert Brown"];
  const origins = ["Factory A", "Factory B", "Factory C", "Warehouse X", "Warehouse Y"];
  const branches = ["Branch 1", "Branch 2", "Branch 3", "Branch 4", "Branch 5"];

  const batches: Array<{
    id: number;
    batchNumber: string;
    product: string;
    manufactureDate: string;
    expiryDate: string;
    status: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    origination: string;
    branch: string;
  }> = [];

  for (let i = 1; i <= 2000; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const manufactureDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(manufactureDate.getTime() + Math.random() * 730 * 24 * 60 * 60 * 1000);
    const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const updatedDate = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const batchNumber = `BATCH${String(i).padStart(4, "0")}-${Math.floor(Math.random() * 1000)}`;
    const quantity = Math.floor(Math.random() * 1000) + 100;
    const createdBy = creators[Math.floor(Math.random() * creators.length)];
    const origination = origins[Math.floor(Math.random() * origins.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];

    batches.push({
      id: i,
      batchNumber,
      product: `${randomProduct} Batch ${i}`,
      manufactureDate: manufactureDate.toISOString().split("T")[0],
      expiryDate: expiryDate.toISOString().split("T")[0],
      status: randomStatus,
      quantity,
      createdAt: createdDate.toISOString().split("T")[0],
      updatedAt: updatedDate.toISOString().split("T")[0],
      createdBy,
      origination,
      branch,
    });
  }

  return batches;
};

const mockBatches = generateMockBatches();

const BatchColumns: ColumnDef[] = [
  { id: "id", accessorKey: "id", header: "ID", sortable: true, filterable: true },
  {
    id: "batchNumber",
    accessorKey: "batchNumber",
    header: "Batch Number",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <span className="font-mono text-sm" title={value}>
        {value}
      </span>
    ),
  },
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
    id: "manufactureDate",
    accessorKey: "manufactureDate",
    header: "Manufacture Date",
    sortable: true,
    filterable: true,
    cell: (value: string) => <span className="text-sm">{value}</span>,
  },
  {
    id: "expiryDate",
    accessorKey: "expiryDate",
    header: "Expiry Date",
    sortable: true,
    filterable: true,
    cell: (value: string, row: any) => {
      const expiry = new Date(value);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let statusColor = "bg-gray-100 text-gray-800";
      let statusText = value;

      if (daysUntilExpiry < 0) {
        statusColor = "bg-red-100 text-red-800";
        statusText = `Expired (${Math.abs(daysUntilExpiry)} days ago)`;
      } else if (daysUntilExpiry <= 30) {
        statusColor = "bg-yellow-100 text-yellow-800";
        statusText = `Expiring in ${daysUntilExpiry} days`;
      } else {
        statusText = `Valid until ${value}`;
      }

      return <Badge className={statusColor}>{statusText}</Badge>;
    },
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
            : value === "Pending"
              ? "bg-blue-100 text-blue-800"
              : value === "Recalled"
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
        }
      >
        {value}
      </Badge>
    ),
    options: [
      { value: "Active", label: "Active" },
      { value: "Pending", label: "Pending" },
      { value: "Recalled", label: "Recalled" },
      { value: "Expired", label: "Expired" },
    ],
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Quantity",
    sortable: true,
    filterable: true,
    cell: (value: number) => <Badge className="bg-blue-100 text-blue-800">{value.toLocaleString()}</Badge>,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    sortable: true,
    filterable: true,
    cell: (value: string) => <span className="text-muted-foreground text-sm">{value}</span>,
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated",
    sortable: true,
    filterable: true,
    cell: (value: string) => <span className="text-muted-foreground text-sm">{value}</span>,
  },
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Created By",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <span className="text-sm" title={value}>
        {value}
      </span>
    ),
  },
  {
    id: "origination",
    accessorKey: "origination",
    header: "Origination",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <span className="text-sm" title={value}>
        {value}
      </span>
    ),
  },
  {
    id: "branch",
    accessorKey: "branch",
    header: "Branch",
    sortable: true,
    filterable: true,
    cell: (value: string) => (
      <span className="text-sm" title={value}>
        {value}
      </span>
    ),
  },
];

const BatchForm: React.FC<
  FormProps<{
    id?: number;
    batchNumber: string;
    product: string;
    manufactureDate: string;
    expiryDate: string;
    status: string;
    quantity: number | string;
    createdAt?: string;
    updatedAt?: string;
    createdBy: string;
    origination: string;
    branch: string;
  }>
> = ({ item, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    batchNumber: item?.batchNumber ?? "",
    product: item?.product ?? "",
    manufactureDate: item?.manufactureDate ?? "",
    expiryDate: item?.expiryDate ?? "",
    status: item?.status ?? "Active",
    quantity: item?.quantity ?? "",
    createdBy: item?.createdBy ?? "",
    origination: item?.origination ?? "",
    branch: item?.branch ?? "",
  });
  const [openManufacture, setOpenManufacture] = useState(false);
  const [openExpiry, setOpenExpiry] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNum = Number(formData.quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }
    onSubmit({ ...formData, quantity: quantityNum });
  };

  const today = new Date();

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{item ? "Edit Batch" : "Add New Batch"}</DialogTitle>
        <DialogDescription>
          {item ? "Update the batch information" : "Create a new batch for your product"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input
            id="batchNumber"
            value={formData.batchNumber}
            onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            placeholder="Enter batch number (e.g., BATCH0001-123)"
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufactureDate">Manufacture Date</Label>
            <Popover open={openManufacture} onOpenChange={setOpenManufacture}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!formData.manufactureDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.manufactureDate ? (
                    format(new Date(formData.manufactureDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.manufactureDate ? new Date(formData.manufactureDate) : undefined}
                  onSelect={(date) => {
                    setFormData({ ...formData, manufactureDate: date ? date.toISOString().split("T")[0] : "" });
                    setOpenManufacture(false);
                  }}
                  initialFocus
                  fromDate={new Date(2020, 0, 1)}
                  toDate={today}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Popover open={openExpiry} onOpenChange={setOpenExpiry}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!formData.expiryDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiryDate ? format(new Date(formData.expiryDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                  onSelect={(date) => {
                    setFormData({ ...formData, expiryDate: date ? date.toISOString().split("T")[0] : "" });
                    setOpenExpiry(false);
                  }}
                  initialFocus
                  fromDate={today}
                  toDate={new Date(today.getFullYear() + 3, 11, 31)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Recalled">Recalled</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createdBy">Created By</Label>
          <Input
            id="createdBy"
            value={formData.createdBy}
            onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
            placeholder="Enter creator name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="origination">Origination</Label>
          <Input
            id="origination"
            value={formData.origination}
            onChange={(e) => setFormData({ ...formData, origination: e.target.value })}
            placeholder="Enter origination location"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            placeholder="Enter branch name"
            required
          />
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

const BatchManagement: React.FC = () => {
  const stats = [
    { label: "Total Batches", value: mockBatches.length },
    { label: "Active", value: mockBatches.filter((b) => b.status === "Active").length, color: "text-green-600" },
    {
      label: "Expiring Soon",
      value: mockBatches.filter((b) => {
        const expiry = new Date(b.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      }).length,
      color: "text-yellow-600",
    },
    {
      label: "Expired",
      value: mockBatches.filter((b) => {
        const expiry = new Date(b.expiryDate);
        const today = new Date();
        return expiry < today;
      }).length,
      color: "text-red-600",
    },
  ];

  const handleAddBatch = useCallback(
    (data: {
      batchNumber: string;
      product: string;
      manufactureDate: string;
      expiryDate: string;
      status: string;
      quantity: number;
      createdBy: string;
      origination: string;
      branch: string;
    }) => {
      console.log("Add batch:", data);
    },
    [],
  );

  return (
    <GenericReport
      title="Batch Management"
      data={mockBatches}
      columns={BatchColumns}
      icon={<PackageIcon className="text-primary h-6 w-6" />}
      onSubmitAdd={handleAddBatch}
      stats={stats}
      FormComponent={BatchForm}
    />
  );
};
export default BatchManagement;
