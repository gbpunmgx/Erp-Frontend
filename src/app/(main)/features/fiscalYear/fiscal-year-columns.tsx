import { Column } from "@/components/common/TabletCommon";
import { FiscalYear } from "./types/fiscal-year";

export const fiscalYearColumns: Column<FiscalYear>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "startDate", header: "Start Date", sortable: true },
  { key: "endDate", header: "End Date", sortable: true },
  { key: "description", header: "Description", sortable: true },
  {
    key: "active",
    header: "Active",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "isCurrentYear",
    header: "Current Year",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          value ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    ),
  },
  {
    key: "isClosed",
    header: "Closed",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          value ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        {value ? "Closed" : "Open"}
      </span>
    ),
  },
];
