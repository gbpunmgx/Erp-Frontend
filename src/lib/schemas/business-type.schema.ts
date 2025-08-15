import * as yup from "yup";

export const businessTypeSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  id: yup.number().optional(),
});
