import { Column } from "@/components/common/TabletCommon";
import { ActionsCell } from "@/lib/actions-cell";
import { Employee } from "../types/employee";

export const employeeColumns: Column<Employee>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "firstName", header: "First Name", sortable: true },
  { key: "middleName", header: "Middle Name" },
  { key: "lastName", header: "Last Name", sortable: true },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
  { key: "dateOfBirth", header: "Date of Birth" },
  { key: "hireDate", header: "Hire Date" },
  {
    key: "gender",
    header: "Gender",
    sortable: true,
    render: (value: Employee["gender"]) => <span className="capitalize">{value.toLowerCase()}</span>,
  },
  {
    key: "maritalStatus",
    header: "Marital Status",
    sortable: true,
    render: (value: Employee["maritalStatus"]) => <span className="capitalize">{value.toLowerCase()}</span>,
  },
  {
    key: "status",
    header: "Status",
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
    key: "user",
    header: "Username",
    render: (_value, row) => row.user?.username ?? "",
  },
  {
    key: "actions",
    header: "Actions",
    sortable: false,
    render: (_value, row) => (
      <ActionsCell
        row={row}
        onView={(r) => alert(`Viewing ${r.firstName} ${r.lastName}`)}
        onEdit={(r) => alert(`Editing ${r.firstName} ${r.lastName}`)}
        onDelete={(r) => alert(`Deleting ${r.firstName} ${r.lastName}`)}
        actionOptions={{
          edit: { showInitial: true },
          delete: { showInitial: false },
        }}
      />
    ),
  },
];
