"use client";

import { ActionsCell } from "@/lib/actions-cell";
import { Column, DataTable } from "../../../../components/common/TabletCommon";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  phone: string;
  department: string;
  location: string;
  createdAt: string;
  lastLogin: string;
};

const columns: Column<User>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
  { key: "role", header: "Role", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (value: User["status"]) => {
      let color = "";
      switch (value) {
        case "Active":
          color = "bg-green-100 text-green-800";
          break;
        case "Inactive":
          color = "bg-red-100 text-red-800";
          break;
        case "Pending":
          color = "bg-yellow-100 text-yellow-800";
          break;
      }
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>{value}</span>;
    },
  },
  { key: "phone", header: "Phone" },
  { key: "department", header: "Department" },
  { key: "location", header: "Location" },
  { key: "createdAt", header: "Created At" },
  { key: "lastLogin", header: "Last Login" },
  {
    key: "actions",
    header: "Actions",
    sortable: false,
    render: (_value: any, row: User) => (
      <ActionsCell
        row={row}
        onView={(r) => alert(`Viewing ${r.name}`)}
        onEdit={(r) => alert(`Editing ${r.name}`)}
        onDelete={(r) => alert(`Deleting ${r.name}`)}
        actionOptions={{
          edit: { showInitial: true },
          delete: { showInitial: false },
        }}
      />
    ),
  },
];

const data: User[] = [
  {
    id: 1,
    name: "John Dodddddd ddddd  dddddd ddddddddd ddddddd dddddddddddddddddd ddddddddddddddddddde",
    email: "john@mail.com",
    role: "Admin",
    status: "Active",
    phone: "123-456-7890",
    department: "IT",
    location: "New York",
    createdAt: "2023-01-01",
    lastLogin: "2023-10-01",
  },
  {
    id: 2,
    name: "Sara Smith",
    email: "sara@mail.com",
    role: "User",
    status: "Inactive",
    phone: "987-654-3210",
    department: "HR",
    location: "Los Angeles",
    createdAt: "2023-02-15",
    lastLogin: "2023-09-15",
  },
  {
    id: 3,
    name: "Mark Johnson",
    email: "mark@mail.com",
    role: "Manager",
    status: "Pending",
    phone: "555-555-5555",
    department: "Finance",
    location: "Chicago",
    createdAt: "2023-03-10",
    lastLogin: "2023-09-30",
  },
];

export default function DemoPage() {
  return (
    <div className="p-4">
      <DataTable<User> data={data} columns={columns} />
    </div>
  );
}
