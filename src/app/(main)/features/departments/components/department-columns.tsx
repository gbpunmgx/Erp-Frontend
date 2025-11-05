import { Column } from "@/components/common/TabletCommon";
import { ActionsCell } from "@/lib/actions-cell";
import { Department } from "../types/department";

export const departmentColumns: Column<Department>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "description", header: "Description" },
  { key: "location", header: "Location" },
  { key: "organizationId", header: "Organization ID" },
  { key: "branchId", header: "Branch ID" },
  {
    key: "actions",
    header: "Actions",
    render: (_value, row) => (
      <ActionsCell row={row} onEdit={(r) => alert(`Editing ${r.name}`)} onDelete={(r) => alert(`Deleting ${r.name}`)} />
    ),
  },
];
