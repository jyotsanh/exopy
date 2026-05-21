import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET must be at least 10 characters"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.string().min(1, "GOOGLE_CALLBACK_URL is required"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),

  SUPERADMIN_EMAIL: z
    .string()
    .email("SUPERADMIN_EMAIL must be a valid email")
    .default("hamaljyotsan@gmail.com"),
  SUPERADMIN_PASSWORD: z
    .string()
    .min(1, "SUPERADMIN_PASSWORD is required")
    .default("superadmin"),
  SUPERADMIN_USERNAME: z
    .string()
    .min(1, "SUPERADMIN_USERNAME is required")
    .default("superadmin"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
