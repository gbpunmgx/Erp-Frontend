import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
});
