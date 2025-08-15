import { ColumnDef } from "@tanstack/react-table";
import { OrganizationWithId } from "@/app/(main)/features/organization/all/types/organization-type";

export const columns: ColumnDef<OrganizationWithId>[] = [
  {
    accessorKey: "name",
    header: "Organization Name",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "code",
    header: "Code",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "phoneNo",
    header: "Phone Number",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "address",
    header: "Address",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "panNo",
    header: "PAN Number",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "establishDate",
    header: "Established Date",
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      const rowDate = new Date(row.getValue(id));
      const filterDate = new Date(filterValue);
      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "active",
    header: "Active",
    filterFn: "equals",
    cell: ({ row }) => (row.getValue("active") ? "Yes" : "No"),
  },
  {
    accessorKey: "businessType.name",
    header: "Business Type",
    filterFn: "includesString",
    cell: ({ row }) => row.original.businessType?.name ?? "-",
  },
];
