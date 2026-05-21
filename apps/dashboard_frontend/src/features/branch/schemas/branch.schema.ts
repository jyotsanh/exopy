import { z } from "zod";

export const branchSchema = z.object({
  name: z
    .string()
    .min(1, "Branch name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      { message: "Please enter a valid email address" }
    ),

  address: z
    .string()
    .max(250, "Address must not exceed 250 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  contact_number: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return /^[+]?[\d\s().-]{7,20}$/.test(val);
      },
      { message: "Please enter a valid phone number" }
    ),
});

export type BranchSchemaType = z.infer<typeof branchSchema>;
