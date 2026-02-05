import * as z from 'zod';

export const registrationSchema = z.object({
  fullName: z.string()
    .min(2, "Name is too short")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  
  email: z.string().email("Invalid email format"),
  
  phone: z.string()
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
  
  dob: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Invalid date selected" }),
  
  city: z.string()
    .max(20, "Max 20 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  
  country: z.string()
    .max(20, "Max 20 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one digit")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
    
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Sets the error to the confirm field
});