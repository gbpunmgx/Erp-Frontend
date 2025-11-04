import { Column } from "@/components/common/TabletCommon";
import { ActionsCell } from "@/lib/actions-cell";

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
      <ActionsCell
        row={row}
        onView={(r) => alert(`Viewing`)}
        onEdit={(r) => alert(`Editing `)}
        onDelete={(r) => alert(`Deleting`)}
        actionOptions={{
          edit: { showInitial: true },
          delete: { showInitial: false },
        }}
      />
    ),
  },
];
