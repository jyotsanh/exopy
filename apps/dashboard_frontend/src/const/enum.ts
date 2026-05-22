export const Role = {
  Admin: "admin",
  SuperAdmin: "superadmin",
} as const;

export type Role = typeof Role[keyof typeof Role];