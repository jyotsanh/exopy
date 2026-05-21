import { Types } from "mongoose";

export interface IRegion {
  _id: Types.ObjectId;
  name: string;
  contact_number?: string;
  email?: string;
  org_id: Types.ObjectId;
  created_by: Types.ObjectId;
  updated_by?: Types.ObjectId;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}
