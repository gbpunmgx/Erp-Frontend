"use client";

import { Card } from "@/components/ui/card";
import { Clock5Icon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { AttendanceTable } from "@/app/(main)/features/attendances/components/attendance-table";
import EmployeeTypeChart from "@/app/(main)/features/attendances/components/employee-type-chart";
import AttendanceChart from "@/app/(main)/features/attendances/components/attendance-chart";

export default function AttendanceDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("7"); // July

  const [employees, setEmployees] = useState<(Employee & { attendance: string[]; leaveDays: string })[]>([]);

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const getDaysInMonth = (month: string, year: string) => new Date(+year, +month, 0).getDate();

  const generateEmployeeData = (daysInMonth: number) => {
    const names = [
      "Anthony Thomas",
      "Benjamin Martinez",
      "Christopher Moore",
      "Diana Rodriguez",
      "Emily Johnson",
      "Frank Wilson",
      "Grace Taylor",
      "Henry Brown",
      "Isabella Davis",
      "Jack Miller",
      "Katherine Wilson",
    ];

    return names.map((name, i) => ({
      id: i + 1,
      userId: i + 1,
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      email: `${name.split(" ")[0].toLowerCase()}@example.com`,
      phone: "1234567890",
      dateOfBirth: "1990-01-01",
      hireDate: "2020-01-01",
      gender: "MALE" as const,
      maritalStatus: "SINGLE" as const,
      attendance: Array.from({ length: daysInMonth }, () => {
        const r = Math.random();
        if (r < 0.7) return "present";
        if (r < 0.85) return "absent";
        return "late";
      }),
      leaveDays: `${Math.floor(Math.random() * 5)} Days`,
    }));
  };

  useEffect(() => {
    const days = getDaysInMonth(selectedMonth, selectedYear);
    setEmployees(generateEmployeeData(days));
  }, [selectedMonth, selectedYear]);

  const isWeekend = (day: number, month: string, year: string) => {
    const date = new Date(+year, +month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=40&background=random`;

  return (
    <Card className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Clock5Icon className="text-primary h-8 w-8" />
            <span>Manage Attendance</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage user roles, permissions, and access control</p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Attachments
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <EmployeeTypeChart />
      </div>

      <AttendanceTable
        employees={employees.filter((e) =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
        )}
        daysInMonth={getDaysInMonth(selectedMonth, selectedYear)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        isWeekend={isWeekend}
        generateAvatarUrl={generateAvatarUrl}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        months={months}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
      />
    </Card>
  );
}
