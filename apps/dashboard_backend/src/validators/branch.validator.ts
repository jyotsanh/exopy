import { z } from "zod";

export const createBranchODT = z.object({
  name: z.string().min(1, "Name is required").max(100),
  address: z.string().max(255).optional(),
  contact_number: z.string().max(20).optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

export const updateBranchODT = z.object({
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
  email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
});

export const branchIdParamODT = z.object({
  orgId: z
    .string()
    .min(1, "Organization ID is required")
    .length(24, "Invalid Organization ID"),
  regionId: z
    .string()
    .min(1, "Region ID is required")
    .length(24, "Invalid Region ID"),
  id: z
    .string()
    .min(1, "Branch ID is required")
    .length(24, "Invalid Branch ID"),
});

export const branchScopeParamODT = z.object({
  orgId: z
    .string()
    .min(1, "Organization ID is required")
    .length(24, "Invalid Organization ID"),
  regionId: z
    .string()
    .min(1, "Region ID is required")
    .length(24, "Invalid Region ID"),
});

export const branchPaginationQueryODT = z.object({
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
