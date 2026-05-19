import { Types } from "mongoose";

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  contact_number?: string;
  email: string;
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