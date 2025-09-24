"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/app/(main)/features/access_control/types/user";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "roleId",
    header: "Role",
    cell: ({ row }) => <div>{row.getValue("roleId")}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    cell: ({ row }) => <div>{row.getValue("employeeId") ?? "N/A"}</div>,
    enableColumnFilter: false, // ignore in search dropdown
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: () => <div>*****</div>,
    enableColumnFilter: false, // ignore in search dropdown
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
    enableColumnFilter: false,
  },
];
