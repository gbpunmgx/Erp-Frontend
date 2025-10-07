import { User } from "@/app/(main)/features/access_control/types/user";

export interface Employee {
  id?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hireDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  status: boolean;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}
