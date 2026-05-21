import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Role } from "../constants/enum.js";
import { env } from "../config/env.js";

export async function seedSuperAdmin(): Promise<void> {
  const email = env.SUPERADMIN_EMAIL.toLowerCase().trim();

  const existing = await User.findOne({ email, is_deleted: false });
  if (existing) {
    console.log(`Super admin already exists for ${email}, skipping seed.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(env.SUPERADMIN_PASSWORD, 10);

  await User.create({
    email,
    password: hashedPassword,
    username: env.SUPERADMIN_USERNAME,
    role: Role.SUPERADMIN,
  });

  console.log(`Super admin seeded: ${email}`);
}
