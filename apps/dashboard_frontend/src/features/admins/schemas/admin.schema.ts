import { z } from "zod";

export const createAdminSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(100, "Username must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  org_id: z.string().length(24, "Select an organization"),
});

export type CreateAdminSchemaType = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(100, "Username must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  org_id: z.string().length(24, "Select an organization").optional(),
});

export type UpdateAdminSchemaType = z.infer<typeof updateAdminSchema>;

export const resetAdminPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetAdminPasswordSchemaType = z.infer<
  typeof resetAdminPasswordSchema
>;
