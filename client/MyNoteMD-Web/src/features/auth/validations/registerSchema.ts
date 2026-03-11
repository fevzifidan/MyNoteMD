import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup.string().required("Given name is required").min(3, "Name is too short"),
  surname: yup.string().required("Family name is required").min(3, "Surname is too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    // Küçük harf kontrolü
    .matches(/[a-z]/, "Passwords must have at least one lowercase ('a'-'z').")
    // Büyük harf kontrolü
    .matches(/[A-Z]/, "Passwords must have at least one uppercase ('A'-'Z').")
    // Alfanumerik olmayan (özel karakter) kontrolü
    .matches(/[^a-zA-Z0-9]/, "Passwords must have at least one non alphanumeric character."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});