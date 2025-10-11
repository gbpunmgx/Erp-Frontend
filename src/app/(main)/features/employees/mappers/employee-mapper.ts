import { Employee } from "@/app/(main)/features/employees/types/employee";
import { EmployeeFormValues } from "@/app/(main)/features/employees/schemas/employee-schema";

/**
 * Converts form values into a clean Employee object
 * ready for API submission.
 */
export function toEmployee(values: EmployeeFormValues): Employee {
  return {
    id: values.id,
    firstName: values.firstName.trim(),
    middleName: values.middleName?.trim() ?? "",
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    dateOfBirth: values.dateOfBirth,
    hireDate: values.hireDate,
    gender: values.gender,
    maritalStatus: values.maritalStatus,
    status: values.status,
    user: values.isUser
      ? {
          id: values.user?.id,
          username: values.user?.username.trim() ?? "",
          password: values.user?.password ?? "",
          roleId: Number(values.user?.roleId) || 0,
          status: values.user?.status ?? true,
          organizationId: values.user?.organizationId,
          branchId: values.user?.branchId,
        }
      : undefined,
  };
}

/**
 * Converts an Employee object (from API) into EmployeeFormValues
 * for Formik initialization when editing.
 */
export function toEmployeeFormValues(employee: Employee): EmployeeFormValues {
  return {
    id: employee.id,
    firstName: employee.firstName,
    middleName: employee.middleName ?? "",
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    dateOfBirth: employee.dateOfBirth,
    hireDate: employee.hireDate,
    gender: employee.gender,
    maritalStatus: employee.maritalStatus,
    status: employee.status,

    isUser: !!employee.user,

    user: employee.user
      ? {
          id: employee.user.id,
          username: employee.user.username,
          password: "",
          confirmPassword: "",
          roleId: employee.user.roleId,
          status: employee.user.status,
          organizationId: employee.user.organizationId,
          branchId: employee.user.branchId,
        }
      : {
          username: "",
          password: "",
          confirmPassword: "",
          roleId: 0,
          status: true,
        },
  };
}
