"use client";

import React, { useEffect, useState } from "react";
import { AttendanceTable } from "./components/attendance-table";
import { Employee } from "../employees/types/employee";
import { useSidebar } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AttendanceDashboard from "../attendances/attendance-list/page";
import AttendanceService from "@/app/(main)/features/attendances/services/attendance-service";
import { Attendance } from "@/app/(main)/features/attendances/types/attendance";

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("10"); // default to October
  const [selectedYear, setSelectedYear] = useState("2025");
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<(Employee & { attendance: string[]; leaveDays: string })[]>([]);

  const { open: isSidebarOpen } = useSidebar();

  const isWeekend = (day: number, month: string, year: string) => {
    const date = new Date(Number(year), Number(month) - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const generateAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  // ✅ Fetch attendance on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data: Attendance[] = await AttendanceService.getAll();

        // Group attendance by employee
        const grouped = data.reduce<Record<number, Attendance[]>>((acc, entry) => {
          const empId = entry.employee?.id;
          if (!empId) return acc;
          if (!acc[empId]) acc[empId] = [];
          acc[empId].push(entry);
          return acc;
        }, {});

        // Transform into the format your table needs
        const transformedEmployees = Object.entries(grouped).map(([empId, records]) => {
          const firstRecord = records[0];
          const employee = firstRecord.employee as Employee;

          // Assuming only one month/year is used at a time
          const daysInMonth = 30;
          const attendanceArray = Array(daysInMonth).fill("-");

          records.forEach((record) => {
            if (record.date) {
              const day = new Date(record.date).getDate();
              attendanceArray[day - 1] = record.status;
            }
          });

          const leaveCount = attendanceArray.filter((status) => status === "A").length;

          return {
            ...employee,
            attendance: attendanceArray,
            leaveDays: leaveCount.toString(),
          };
        });

        setEmployees(transformedEmployees);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  return (
    <div
      className="overflow-x-auto p-4 transition-all duration-300"
      style={{ maxWidth: !isSidebarOpen ? "calc(100% - 16rem)" : "100%" }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setOpen(true)}>
          Do your Attendance
        </Button>
      </div>

      <AttendanceTable
        employees={employees}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Dashboard</DialogTitle>
          </DialogHeader>
          <AttendanceDashboard />
        </DialogContent>
      </Dialog>
    </div>
  );
}
