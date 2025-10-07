"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, Shield } from "lucide-react";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { Pagination } from "@/components/common";
import EmployeeService from "@/app/(main)/features/employees/services/employee-service";
import EmployeeCard from "@/app/(main)/features/employees/components/employee-card";
import EmployeeFilters from "@/app/(main)/features/employees/components/employee-filters";
import EmployeeList from "@/app/(main)/features/employees/components/employee-list";
import { toast } from "sonner";
import EmployeeForm from "@/app/(main)/features/employees/components/employee-form";
import { Card } from "@/components/ui/card";
import { useEmployees } from "@/lib/hooks/api_data/use-employees";

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(viewMode === "grid" ? 8 : 10);
  const [activeTab, setActiveTab] = useState<"employee" | "leave">("employee");
  const [showFormPage, setShowFormPage] = useState(false);
  const [formMode] = useState<"create" | "update">("create");
  const { employees, loading } = useEmployees();

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
      if (formMode === "create") {
        const newEmployee = await EmployeeService.create(employeeData);
        toast.success("Employee created successfully!");
      } else if (formMode === "update" && employeeData.id) {
        const updatedEmployee = await EmployeeService.update(employeeData.id, employeeData);
        toast.success("Employee updated successfully!");
      }
    } catch {
      toast.error("Failed to save employee. Please try again.");
    } finally {
      setShowFormPage(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random`;

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
            <Button variant="outline">
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setShowFormPage((prev) => !prev)}>
              {showFormPage ? (
                <>
                  <Shield className="mr-1 h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add Employee
                </>
              )}
            </Button>
          </div>
        </div>

        {!showFormPage && (
          <>
            <EmployeeFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              clearFilters={() => setSearchTerm("")}
            />

            {viewMode === "grid" ? (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {paginatedEmployees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    formatDate={formatDate}
                    generateAvatarUrl={generateAvatarUrl}
                  />
                ))}
              </div>
            ) : (
              <EmployeeList
                employees={paginatedEmployees}
                totalItems={filteredEmployees.length}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                formatDate={formatDate}
                generateAvatarUrl={generateAvatarUrl}
              />
            )}

            {viewMode === "grid" && (
              <Pagination
                totalItems={filteredEmployees.length}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                dataSize={`${filteredEmployees.length} items`}
              />
            )}
          </>
        )}

        {showFormPage && (
          <div className="w-full">
            <EmployeeForm defaultValues={selectedEmployee ?? undefined} onSubmit={handleFormSubmit} loading={false} />
          </div>
        )}
      </div>
    </Card>
  );
}
