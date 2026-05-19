// features/organization/types/organization.types.ts

import type { OrganizationSchemaType } from "../schemas/organization.schema";

// Form type is now derived from the Zod schema
export type OrganizationForm = OrganizationSchemaType;

export interface AvatarColor {
  bgColor: string;
  textColor: string;
}

export interface OrganizationEntity {
  _id: string;
  name: string;
  email: string;
  address?: string;
  contact_number?: string;
}