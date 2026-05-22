import type {
  CreateAdminSchemaType,
  UpdateAdminSchemaType,
  ResetAdminPasswordSchemaType,
} from "../schemas/admin.schema";

export type CreateAdminForm = CreateAdminSchemaType;
export type UpdateAdminForm = UpdateAdminSchemaType;
export type ResetAdminPasswordForm = ResetAdminPasswordSchemaType;

export interface PopulatedOrg {
  _id: string;
  name: string;
  email: string;
}

export interface AdminEntity {
  _id: string;
  username: string;
  email: string;
  role: "admin";
  org_id?: PopulatedOrg | string;
  profile_image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvatarColor {
  bgColor: string;
  textColor: string;
}
