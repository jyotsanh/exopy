import { z } from "zod";

export const createOrganizationODT = z.object({
  name: z.string().min(1, "Name is required").max(100),

  address: z.string().max(255).optional(),

  contact_number: z.string().max(20).optional(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

export const updateOrganizationODT = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  address: z
    .string()
    .max(255, "Address must be at most 255 characters")
    .optional(),
  contact_number: z
    .string()
    .max(20, "Contact number must be at most 20 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const organizationIdParamODT = z.object({
  id: z.string().min(1, "Organization ID is required").length(24, "Invalid Organization ID"),
});

export const paginationQueryODT = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1, "Limit must be at least 1").max(100, "Limit must be at most 100")),
  search: z.string().optional(),
});