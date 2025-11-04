import { Column } from "@/components/common/TabletCommon";
import { Box, Trash2 } from "lucide-react";

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  active: boolean;
  deleted: boolean;
  branch: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const assetCategoryColumns: Column<AssetCategory>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "description", header: "Description" },
  {
    key: "active",
    header: "Active",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "deleted",
    header: "Deleted",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${value ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
      >
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "branch",
    header: "Branch",
    render: (branch) => branch?.name ?? "-",
  },
  { key: "createdAt", header: "Created At", sortable: true },
  { key: "updatedAt", header: "Updated At", sortable: true },
  {
    key: "actions",
    header: "Actions",
    sortable: false,
    render: (_value, row) => (
      <div className="flex gap-2">
        <Box className="cursor-pointer text-blue-600" onClick={() => console.log("Edit", row)} />
        <Trash2 className="cursor-pointer text-red-600" onClick={() => console.log("Delete", row)} />
      </div>
    ),
  },
];
