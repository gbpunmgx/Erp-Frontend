import { ColumnDef } from "@tanstack/react-table";
import { BusinessTypeWithId } from "@/app/(main)/features/organization/businessType/types/business-type";

export const columns: ColumnDef<BusinessTypeWithId>[] = [
  {
    accessorKey: "name",
    header: "Business Type Name",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "description",
    header: "Description",
    filterFn: "includesString",
    cell: (info) => info.getValue(),
  },
];
