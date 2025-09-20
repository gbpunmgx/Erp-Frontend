"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, Shield, Users } from "lucide-react";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { dummyEmployees } from "@/app/(main)/features/employees/components /dummydata";
import EmployeeFilters from "@/app/(main)/features/employees/components /employee-filters";
import EmployeeCard from "@/app/(main)/features/employees/components /employee-card";
import EmployeeList from "@/app/(main)/features/employees/components /employee-list";
import { Pagination } from "@/components/common";

export default function EmployeeManagement() {
  const [employees] = useState<Employee[]>(dummyEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(viewMode === "grid" ? 8 : 10);
  const [activeTab, setActiveTab] = useState<"employee" | "leave">("employee");

  // NEW: sorting state
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Filter
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

  // NEW: sorting logic
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

  const total = useMemo(() => employees.length, [employees]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    return sortedEmployees.slice(startIndex, startIndex + pageSize);
  }, [sortedEmployees, pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(0);
    setPageSize(viewMode === "grid" ? 8 : 10);
  }, [searchTerm, viewMode]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random`;
  };

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

  return (
    <Card className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div>
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="text-primary h-8 w-8" />
                <span>Role Management System</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Manage user roles, permissions, and access control</p>
            </div>
            <div className="flex items-center gap-3">
              <Button>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button>
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
                key={employee.userId}
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

        {viewMode === "grid" && filteredEmployees.length > 0 && (
          <Pagination
            totalItems={filteredEmployees.length}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            dataSize={`${filteredEmployees.length} items`}
          />
        )}
      </div>
    </Card>
  );
}
