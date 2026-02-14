import { z } from "zod";



export const trekPlanSchema = z.object({
  title: z.string()
    .min(5, "Must be 5-50 characters")
    .max(50, "Must be 5-50 characters"),
  location: z.string()
    .min(3, "Must be 3-50 characters")
    .max(50, "Must be 3-50 characters"),
  timePlanned: z.string().min(1, "Date is required"),
  estBudget: z.number({ invalid_type_error: "Enter a valid number" })
    .min(1, "Budget is required")
    .max(999999, "Max 6 digits allowed"),
  description: z.string()
    .min(20, "Must be 20-500 characters")
    .max(500, "Must be 20-500 characters"),
  itinerary: z.array(
    z.object({
      activity: z.string().min(1, "Required").max(200, "Max 200 characters"),
    })
  ).min(1, "Add at least one day"),
});