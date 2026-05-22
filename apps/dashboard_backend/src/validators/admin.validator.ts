import { z } from "zod";

export const adminIdParamODT = z.object({
  id: z.string().min(1, "Admin ID is required").length(24, "Invalid Admin ID"),
});

export const updateAdminODT = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(100, "Username must be at most 100 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
  profile_image: z.string().url("Profile image must be a valid URL").optional(),
  org_id: z
    .string()
    .length(24, "Invalid org_id")
    .optional(),
});

export const resetAdminPasswordODT = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const adminPaginationQueryODT = z.object({
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
  org_id: z.string().length(24, "Invalid org_id").optional(),
});
