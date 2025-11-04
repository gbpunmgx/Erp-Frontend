"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { CardTitle } from "@/components/ui/card";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import getAttendanceIcon from "@/app/(main)/features/attendances/components/attendance-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AttendanceTableProps {
  employees: (Employee & { attendance: string[]; leaveDays: string })[];
  daysInMonth: number;
  selectedMonth: string;
  selectedYear: string;
  isWeekend: (day: number, month: string, year: string) => boolean;
  generateAvatarUrl: (name: string) => string;

  searchTerm: string;
  setSearchTerm: (value: string) => void;
  months: { value: string; label: string }[];
  setSelectedMonth: (value: string) => void;
  setSelectedYear: (value: string) => void;
}

export function AttendanceTable({
  employees,
  daysInMonth,
  selectedMonth,
  selectedYear,
  isWeekend,
  generateAvatarUrl,
  searchTerm,
  setSearchTerm,
  months,
  setSelectedMonth,
  setSelectedYear,
}: AttendanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between pb-4">
        <CardTitle>Employee Attendance</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search"
              className="w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24 flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead className="border-b bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="sticky left-0 z-10 min-w-[220px] bg-gray-100 p-4 text-left font-medium text-gray-700 dark:bg-gray-800">
              Employee
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <th
                key={day}
                className={`min-w-[32px] p-2 text-center font-medium ${
                  isWeekend(day, selectedMonth, selectedYear)
                    ? "bg-red-50 text-red-500 dark:bg-red-900/30"
                    : "text-gray-700"
                }`}
              >
                {day}
              </th>
            ))}
            <th className="min-w-[80px] p-4 text-center font-medium text-gray-700">Leave</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr
              key={employee.id}
              className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900/40" : "bg-white dark:bg-gray-800"}
            >
              <td className="sticky left-0 z-10 border-r bg-gray-50 p-4 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
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
              </td>

              {employee.attendance.map((status, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`p-2 text-center ${
                    isWeekend(dayIndex + 1, selectedMonth, selectedYear) ? "bg-red-50 dark:bg-red-900/30" : ""
                  }`}
                >
                  {getAttendanceIcon(status)}
                </td>
              ))}

              <td className="p-4 text-center">
                <span className="font-medium text-red-600">{employee.leaveDays}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
