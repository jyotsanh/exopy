import type { RegionSchemaType } from "../schemas/region.schema";

export type RegionForm = RegionSchemaType;

export interface AvatarColor {
  bgColor: string;
  textColor: string;
}

export interface RegionEntity {
  _id: string;
  name: string;
  email?: string;
  contact_number?: string;
}
