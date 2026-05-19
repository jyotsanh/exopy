// features/organization/schemas/organization.schema.ts

import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

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
        // Allows: +1 (000) 000-0000, 9800000000, +977-9800000000, etc.
        return /^[+]?[\d\s().-]{7,20}$/.test(val);
      },
      { message: "Please enter a valid phone number" }
    ),
});

export type OrganizationSchemaType = z.infer<typeof organizationSchema>;