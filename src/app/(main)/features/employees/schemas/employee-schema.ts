import * as yup from "yup";

export const employeeSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().optional(),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  hireDate: yup
    .string()
    .required("Hire date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  gender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required("Gender is required"),
  maritalStatus: yup
    .string()
    .oneOf(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
    .required("Marital status is required"),
  status: yup.boolean().required("Status is required"),
});

export const userSchema = yup.object({
  username: yup.string().required("Username required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password required"),
  roleId: yup.number().required("Role required"),
  status: yup.boolean().required("Status is required"),
});

export const combinedSchema = yup.object({
  ...employeeSchema.fields,
  isUser: yup.boolean(),
  user: yup.object().when("isUser", {
    is: true,
    then: () => userSchema.required(),
    otherwise: () => yup.object().optional(),
  }),
});

export type EmployeeFormData = yup.InferType<typeof combinedSchema>;

import { Briefcase, Code, Crown, Users } from "lucide-react";

export const roles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access",
    icon: Crown,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: 2,
    name: "User",
    description: "Standard user",
    icon: Users,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: 3,
    name: "Manager",
    description: "Team management",
    icon: Briefcase,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: 4,
    name: "Developer",
    description: "Code access",
    icon: Code,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
];
