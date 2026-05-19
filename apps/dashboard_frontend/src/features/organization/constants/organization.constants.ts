// features/organization/constants/organization.constants.ts

import type { AvatarColor, OrganizationForm } from "../types/organization.types";

export const AVATAR_COLORS: AvatarColor[] = [
  { bgColor: "bg-blue-100", textColor: "text-blue-500" },
  { bgColor: "bg-green-100", textColor: "text-green-600" },
  { bgColor: "bg-purple-100", textColor: "text-purple-600" },
  { bgColor: "bg-teal-100", textColor: "text-teal-600" },
  { bgColor: "bg-rose-100", textColor: "text-rose-600" },
  { bgColor: "bg-orange-100", textColor: "text-orange-600" },
  { bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
  { bgColor: "bg-cyan-100", textColor: "text-cyan-600" },
];

export const DEFAULT_FORM: OrganizationForm = {
  name: "",
  email: "",
  address: "",
  contact_number: "",
};

export const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export const SEARCH_DEBOUNCE_MS = 400;

export const getAvatarColor = (name: string): AvatarColor =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];