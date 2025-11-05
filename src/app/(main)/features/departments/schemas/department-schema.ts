import * as yup from "yup";
import { Department } from "../types/department";

export const departmentSchema: yup.ObjectSchema<Department> = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Department name required"),
  description: yup.string().optional(),
  location: yup.string().optional(),
  organizationId: yup.number().required("Organization ID required"),
  branchId: yup.number().required("Branch ID required"),
});

export const initialValues: Department = {
  name: "",
  description: "",
  location: "",
  organizationId: 1,
  branchId: 1,
};
