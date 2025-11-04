"use client";

import EmployeeForm from "@/app/(main)/features/employees/components/employee-form";
import EmployeeList from "@/app/(main)/features/employees/components/employee-list";
import EmployeeService from "@/app/(main)/features/employees/services/employee-service";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEmployees } from "@/lib/hooks/api_data/use-employees";
import { useRoles } from "@/lib/hooks/api_data/use-roles";
import { Plus, Shield } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function EmployeeManagement() {
  const { employees: initialEmployees, loading } = useEmployees();
  const { roles } = useRoles();

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode] = useState<"grid" | "list">("grid");
  const [pageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(viewMode === "grid" ? 8 : 10);
  const [showFormPage, setShowFormPage] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  useEffect(() => {
    setPageSize(viewMode === "grid" ? 8 : 10);
  }, [viewMode]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm),
    );
  }, [employees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, pageIndex, pageSize]);

  const handleFormSubmit = async (employeeData: Employee) => {
    try {
      setFormLoading(true);
      let result: Employee;
      if (formMode === "create") {
        result = await EmployeeService.create(employeeData);
        setEmployees((prev) => [...prev, result]);
        toast.success("Employee created successfully!");
      } else {
        if (typeof employeeData.id === "number") {
          result = await EmployeeService.update(employeeData.id, employeeData);
          setEmployees((prev) => prev.map((emp) => (emp.id === result.id ? result : emp)));
          toast.success("Employee updated successfully!");
        } else {
          toast.error("Employee ID is missing. Cannot update employee.");
          return;
        }
      }
      setShowFormPage(false);
      setSelectedEmployee(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process employee";
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <Card className="min-h-screen w-full p-4 md:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="text-primary h-8 w-8" />
              Employee Management System
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage employees, their information, and access control
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!showFormPage ? (
              <Button
                onClick={() => {
                  setSelectedEmployee(null);
                  setFormMode("create");
                  setShowFormPage(true);
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Employee
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowFormPage(false);
                }}
              >
                <Shield className="mr-1 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>

        {showFormPage && (
          <div className="w-full">
            <EmployeeForm
              defaultValues={selectedEmployee ?? undefined}
              onSubmit={handleFormSubmit}
              loading={formLoading}
              roles={roles}
            />
          </div>
        )}
        {!showFormPage && <EmployeeList employees={paginatedEmployees} />}
      </div>
    </Card>
  );
}
