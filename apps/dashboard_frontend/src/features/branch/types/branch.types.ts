import type { BranchSchemaType } from "../schemas/branch.schema";

export type BranchForm = BranchSchemaType;

export interface AvatarColor {
  bgColor: string;
  textColor: string;
}

export interface BranchEntity {
  _id: string;
  name: string;
  email?: string;
  address?: string;
  contact_number?: string;
}
