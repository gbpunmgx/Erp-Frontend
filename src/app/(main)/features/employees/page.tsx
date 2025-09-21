"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, Shield } from "lucide-react";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { Pagination } from "@/components/common";
import EmployeeService from "@/app/(main)/features/employees/services/employee-service";
import EmployeeCard from "@/app/(main)/features/employees/components/employee-card";
import EmployeeFilters from "@/app/(main)/features/employees/components/employee-filters";
import EmployeeList from "@/app/(main)/features/employees/components/employee-list";
import { toast } from "sonner";
import EmployeeDialog from "@/app/(main)/features/employees/components/employee-dialog";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(viewMode === "grid" ? 8 : 10);
  const [activeTab, setActiveTab] = useState<"employee" | "leave">("employee");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update" | "delete">("create");
  const [dialogLoading, setDialogLoading] = useState(false);
  const [selectedEmployeeForDialog, setSelectedEmployeeForDialog] = useState<Employee | null>(null);

  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await EmployeeService.getAll();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        toast.error("Failed to fetch employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.phone.includes(searchTerm),
      );
    }
    return filtered;
  }, [employees, searchTerm]);

  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees;

    return [...filteredEmployees].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null || bVal == null) return 0;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    return sortedEmployees.slice(startIndex, startIndex + pageSize);
  }, [sortedEmployees, pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(0);
    setPageSize(viewMode === "grid" ? 8 : 10);
  }, [searchTerm, viewMode]);

  const openCreateDialog = () => {
    setSelectedEmployeeForDialog(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const openUpdateDialog = (employee: Employee) => {
    setSelectedEmployeeForDialog(employee);
    setDialogMode("update");
    setDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployeeForDialog(employee);
    setDialogMode("delete");
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (employeeData: Employee) => {
    setDialogLoading(true);
    try {
      let updatedEmployee: Employee;

      if (dialogMode === "create") {
        updatedEmployee = await EmployeeService.create(employeeData);
        setEmployees((prev) => [...prev, updatedEmployee]);
        toast.success("Employee created successfully!");
      } else if (dialogMode === "update") {
        updatedEmployee = await EmployeeService.update(employeeData.id!, employeeData);
        setEmployees((prev) => prev.map((emp) => (emp.id === employeeData.id ? updatedEmployee : emp)));
        toast.success("Employee updated successfully!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setDialogLoading(false);
    }
  };
  const handleDialogDelete = async (id: number) => {
    setDialogLoading(true);
    try {
      await EmployeeService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast.success("Employee deleted successfully!");
      setDialogOpen(false);
      setSelectedEmployeeForDialog(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete business type";
      toast.error(errorMessage);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedEmployeeForDialog(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random`;

  const clearFilters = () => {
    setSearchTerm("");
  };

  const setSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <Card className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div>
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="text-primary h-8 w-8" />
                <span>Employee Management System</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage employees, their information, and access control
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>
          <EmployeeFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            clearFilters={clearFilters}
          />
        </div>

        {viewMode === "grid" && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {paginatedEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                formatDate={formatDate}
                openEmployeeDetails={openEmployeeDetails}
                generateAvatarUrl={generateAvatarUrl}
              />
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <EmployeeList
            employees={paginatedEmployees}
            totalItems={sortedEmployees.length}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            formatDate={formatDate}
            openEmployeeDetails={openEmployeeDetails}
            generateAvatarUrl={generateAvatarUrl}
            sortField={sortField}
            sortOrder={sortOrder}
            setSort={setSort}
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

        {/* Employee Dialog */}
        <EmployeeDialog
          employee={selectedEmployeeForDialog}
          mode={dialogMode}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleDialogSubmit}
          onDelete={handleDialogDelete}
          loading={dialogLoading}
        />
      </div>
    </Card>
  );
}
