"use client";

import { Employee } from "@/app/(main)/features/employees/types/employee";
import { DataTable } from "@/components/common/TabletCommon";
import { employeeColumns } from "./employee-columns";

interface EmployeeListProps {
  employees: Employee[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <DataTable<Employee> data={employees} columns={employeeColumns} />
      </div>
    </div>
  );
}
