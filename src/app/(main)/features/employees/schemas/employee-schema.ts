import * as yup from "yup";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { User } from "@/app/(main)/features/access_control/types/user";
import { parse, isValid } from "date-fns";

export interface EmployeeFormValues extends Omit<Employee, "id" | "createdAt" | "updatedAt"> {
  isUser: boolean;
  user?: User & { confirmPassword?: string };
}

export const initialValues: EmployeeFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  hireDate: "",
  gender: "MALE",
  maritalStatus: "SINGLE",
  status: true,
  isUser: false,
  user: {
    username: "",
    password: "",
    confirmPassword: "",
    roleId: 0,
    status: true,
  },
};

export const userSchema = yup.object({
  username: yup.string().required("Username required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password required"),
  confirmPassword: yup
    .string()
    .required("Confirm password required")
    .test("passwords-match", "Passwords must match", function (value) {
      return value === this.parent.password;
    }),
  roleId: yup.number().required("Role required"),
  status: yup.boolean().required("Status is required"),
});

export const employeeSchema = yup.object({
  firstName: yup.string().required("First name required"),
  middleName: yup.string().optional(),
  lastName: yup.string().required("Last name required"),
  email: yup.string().email("Invalid email").required("Email required"),
  phone: yup.string().required("Phone required"),

  dateOfBirth: yup
    .string()
    .required("Date of birth required")
    .test("valid-date", "Invalid date", (value) => {
      if (!value) return false;
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      return isValid(parsed) && value.length === 10;
    }),

  hireDate: yup
    .string()
    .required("Hire date required")
    .test("valid-date", "Invalid date", (value) => {
      if (!value) return false;
      const parsed = parse(value, "yyyy-MM-dd", new Date());
      return isValid(parsed) && value.length === 10;
    }),

  gender: yup.mixed().oneOf(["MALE", "FEMALE", "OTHER"]).required("Gender required"),

  maritalStatus: yup.mixed().oneOf(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).required("Marital status required"),

  status: yup.boolean().required("Status required"),
});

export const combinedSchema = yup.object({
  ...employeeSchema.fields,
  isUser: yup.boolean(),
  user: yup.object().when("isUser", {
    is: true,
    then: (schema) => userSchema.required("User details are required"),
    otherwise: (schema) => yup.object().optional(),
  }),
});
