import { z } from "zod";

export const registerODT = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(2, "Username is too short"),
  role: z.enum(["user", "admin", "superadmin"]).default("user"),
});

export const loginODT = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});