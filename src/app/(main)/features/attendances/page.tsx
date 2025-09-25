"use client";

import React, { useState } from "react";
import { AttendanceTable } from "./components/attendance-table";
import { Employee } from "../employees/types/employee";
import { useSidebar } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AttendanceDashboard from "./attendance-list/page"; // import your dashboard

const employeesData: (Employee & { attendance: string[]; leaveDays: string })[] = [
  {
    id: 1,
    userId: 101,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    dateOfBirth: "1990-01-01",
    hireDate: "2020-01-01",
    gender: "MALE",
    maritalStatus: "SINGLE",
    attendance: Array(30).fill("P"),
    leaveDays: "0",
  },
  {
    id: 2,
    userId: 102,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "0987654321",
    dateOfBirth: "1992-05-15",
    hireDate: "2021-06-01",
    gender: "FEMALE",
    maritalStatus: "MARRIED",
    attendance: Array(30)
      .fill("P")
      .map((status, i) => (i % 7 === 0 ? "A" : status)),
    leaveDays: "4",
  },
];

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  // ...add remaining months
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [open, setOpen] = useState(false); // dialog state

  const { open: isSidebarOpen } = useSidebar(); // <-- get sidebar open state

  const isWeekend = (day: number, month: string, year: string) => {
    const date = new Date(Number(year), Number(month) - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <div
      className="overflow-x-auto p-2 transition-all duration-300 sm:p-4 md:p-6"
      style={{ maxWidth: isSidebarOpen ? "calc(100% - 16rem)" : "96%" }}
    >
      {/* Top bar with Add New */}
      <div className="mb-4 flex justify-end">
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setOpen(true)}>
          Do your Attendance
        </Button>
      </div>

      {/* Attendance Table */}
      <AttendanceTable
        employees={employeesData}
        daysInMonth={30}
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Dashboard</DialogTitle>
          </DialogHeader>
          <AttendanceDashboard />
        </DialogContent>
      </Dialog>
    </div>
  );
}
