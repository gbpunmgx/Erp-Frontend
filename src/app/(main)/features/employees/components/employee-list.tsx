"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { ActionsCell } from "@/lib/actions-cell";
import { Pagination } from "@/components/common";
import { ArrowUpDown } from "lucide-react";

interface EmployeeListProps {
  employees: Employee[];
  totalItems: number;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  formatDate: (dateString: string) => string;
  generateAvatarUrl: (name: string) => string;
  openEmployeeForm: (employee: Employee) => void;
  sortField: keyof Employee | null;
  sortOrder: "asc" | "desc" | null;
  setSort: (field: keyof Employee) => void;
}

export default function EmployeeList({
  employees,
  totalItems,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  formatDate,
  generateAvatarUrl,
  openEmployeeForm,
  sortField,
  sortOrder,
  setSort,
}: EmployeeListProps) {
  const renderSortIcon = (field: keyof Employee) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 inline-block h-4 w-4 text-gray-400" />;
    return <span className="ml-1">{sortOrder === "asc" ? "▲" : "▼"}</span>;
  };

  return (
    <Card className="p-8">
      <CardHeader>
        <CardTitle>Employee List</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => setSort("firstName")}>
                Employee {renderSortIcon("firstName")}
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => setSort("email")}>
                Email {renderSortIcon("email")}
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => setSort("hireDate")}>
                Hire Date {renderSortIcon("hireDate")}
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={generateAvatarUrl(`${employee.firstName} ${employee.lastName}`)} />
                      <AvatarFallback>
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-muted-foreground text-sm">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{formatDate(employee.hireDate)}</TableCell>
                <TableCell>
                  <ActionsCell<Employee>
                    row={employee}
                    onView={() => console.log("View", employee.id)}
                    onEdit={() => openEmployeeForm(employee)}
                    onDelete={() => console.log("Delete", employee.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          totalItems={totalItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          dataSize={`${totalItems} items`}
        />
      </CardContent>
    </Card>
  );
}
