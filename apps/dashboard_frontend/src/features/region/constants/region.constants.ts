import type { AvatarColor, RegionForm } from "../types/region.types";

export const AVATAR_COLORS: AvatarColor[] = [
  {
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-500 dark:text-blue-200",
  },
  {
    bgColor: "bg-green-100 dark:bg-green-900/40",
    textColor: "text-green-600 dark:text-green-200",
  },
  {
    bgColor: "bg-purple-100 dark:bg-purple-900/40",
    textColor: "text-purple-600 dark:text-purple-200",
  },
  {
    bgColor: "bg-teal-100 dark:bg-teal-900/40",
    textColor: "text-teal-600 dark:text-teal-200",
  },
  {
    bgColor: "bg-rose-100 dark:bg-rose-900/40",
    textColor: "text-rose-600 dark:text-rose-200",
  },
  {
    bgColor: "bg-orange-100 dark:bg-orange-900/40",
    textColor: "text-orange-600 dark:text-orange-200",
  },
  {
    bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
    textColor: "text-indigo-600 dark:text-indigo-200",
  },
  {
    bgColor: "bg-cyan-100 dark:bg-cyan-900/40",
    textColor: "text-cyan-600 dark:text-cyan-200",
  },
];

export const DEFAULT_FORM: RegionForm = {
  name: "",
  email: "",
  contact_number: "",
};

export const PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export const SEARCH_DEBOUNCE_MS = 400;

export const getAvatarColor = (name: string): AvatarColor =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
