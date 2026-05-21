import { z } from "zod";

export const createRegionODT = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  contact_number: z.string().max(20).optional(),
});

export const updateRegionODT = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  contact_number: z
    .string()
    .max(20, "Contact number must be at most 20 characters")
    .optional(),
});

export const regionIdParamODT = z.object({
  orgId: z
    .string()
    .min(1, "Organization ID is required")
    .length(24, "Invalid Organization ID"),
  id: z
    .string()
    .min(1, "Region ID is required")
    .length(24, "Invalid Region ID"),
});

export const regionOrgIdParamODT = z.object({
  orgId: z
    .string()
    .min(1, "Organization ID is required")
    .length(24, "Invalid Organization ID"),
});

export const regionPaginationQueryODT = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Page must be at least 1")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit must be at most 100")
    ),
  search: z.string().optional(),
});
