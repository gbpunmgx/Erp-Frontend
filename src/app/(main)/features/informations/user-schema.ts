import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  age: yup
    .number()
    .min(18, "Must be at least 18 years old")
    .max(120, "Invalid age")
    .required("Age is required")
    .typeError("Age must be a number"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Please confirm your password"),
  website: yup.string().url("Invalid URL").notRequired(),
  role: yup.string().required("Role is required"),
});
