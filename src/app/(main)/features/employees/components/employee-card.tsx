"use client";

import React from "react";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActionsCell } from "@/lib/actions-cell";
import { Employee } from "@/app/(main)/features/employees/types/employee";

interface EmployeeCardProps {
  employee: Employee;
  formatDate: (dateString: string) => string;
  generateAvatarUrl: (name: string) => string;
  onEdit?: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, formatDate, generateAvatarUrl, onEdit }: EmployeeCardProps) {
  return (
    <Card className="group relative transition-shadow duration-200 hover:shadow-lg">
      <div className="absolute top-4 right-4 z-10">
        <ActionsCell<Employee>
          row={employee}
          onView={(e) => console.log("View:", e.firstName)}
          onEdit={(e) => onEdit?.(e)}
          onDelete={(e) => console.log("Delete:", e.firstName)}
        />
      </div>

      <CardContent className="p-6 text-center">
        <Avatar className="mx-auto mb-4 h-20 w-20">
          <AvatarImage src={generateAvatarUrl(`${employee.firstName} ${employee.lastName}`)} />
          <AvatarFallback className="text-lg">
            {employee.firstName[0]}
            {employee.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <h3 className="mb-1 text-lg font-semibold">
          {employee.firstName} {employee.lastName}
        </h3>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Hired</span>
            <span>{formatDate(employee.hireDate)}</span>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Phone className="h-4 w-4" />
            <span>{employee.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
