"use client";

import { User } from "@/app/(main)/features/access_control/types/user";
import { Column } from "@/components/common/TabletCommon";
import { ActionsCell } from "@/lib/actions-cell";

export const columns: Column<User>[] = [
  {
    key: "username",
    header: "Username",
    sortable: true,
  },
  {
    key: "roleId",
    header: "Role ID",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value: User["status"]) => (
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
    key: "actions",
    header: "Actions",
    sortable: false,
    render: (_value, row: User) => (
      <ActionsCell<User>
        row={row}
        onView={(r) => console.log("Viewing user:", r)}
        onEdit={(r) => console.log("Editing user:", r)}
        onDelete={(r) => console.log("Deleting user:", r)}
        actionOptions={{
          edit: { showInitial: true },
          delete: { showInitial: true },
        }}
      />
    ),
  },
];
