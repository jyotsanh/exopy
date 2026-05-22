import { z } from "zod";

export const registerODT = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(2, "Username is too short"),
  org_id: z
    .string()
    .min(1, "org_id is required")
    .length(24, "Invalid org_id"),
});

export const loginODT = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordODT = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordWithTokenODT = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});
