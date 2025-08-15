// src/lib/schemas/organization.schema.ts
import * as yup from "yup";

export const organizationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  code: yup.string().required("Code is required").max(20, "Code cannot exceed 20 characters"),
  phoneNo: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s]{7,15}$/, "Phone number must be valid and contain 7 to 15 digits"),
  address: yup.string().required("Address is required").max(200, "Address cannot exceed 200 characters"),
  panNo: yup.string().optional().max(20, "PAN number cannot exceed 20 characters"),
  establishDate: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Establish Date must be in YYYY-MM-DD format"),
  active: yup.boolean().optional(),
  logo: yup.string().optional().url("Logo must be a valid URL"),
  businessType: yup
    .number()
    .typeError("Business Type ID must be a number")
    .required("Business Type ID is required")
    .integer("Business Type ID must be an integer")
    .positive("Business Type ID must be positive"),
});
