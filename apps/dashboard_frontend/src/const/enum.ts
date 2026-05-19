export const Role = {
  Admin: "admin",
  User: "user",
  SuperAdmin: "superadmin",
} as const;

export type Role = typeof Role[keyof typeof Role];