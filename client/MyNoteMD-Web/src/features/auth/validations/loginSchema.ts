import * as yup from "yup";

export const loginSchema = yup.object({
  identifier: yup
    .string()
    .required("Email is required")
    .email("Email should be in a valid format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
}).required();