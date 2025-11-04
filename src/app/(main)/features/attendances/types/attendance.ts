import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { Employee } from "@/app/(main)/features/employees/types/employee";

export interface Attendance {
  id?: number;
  date?: Date;
  checkInTime: number | null | undefined;
  checkOutTime: number | null | undefined;
  status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";
  employee?: Employee;
}
