// src/models/types.ts

import mongoose, { Document } from "mongoose";
import { Role } from "../../constant/enum.js";

export interface IOrganization extends Document {
  id: string;
  name: string;
  address: string;
  contact_number: string;
  email: string;
  created_by: mongoose.Types.ObjectId; // user id
  updated_by?: mongoose.Types.ObjectId; // user id
  is_deleted: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
            
export interface IRegion extends Document {
  id: string;
  name: string;
  address: string;
  contact_number: string;
  email: string;
  org_id: mongoose.Types.ObjectId; // organization id
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBranch extends Document {
  id: string;
  name: string;
  address: string;
  contact_number: string;
  email: string;
  reg_id: mongoose.Types.ObjectId; // region id
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  username: string;
  profile_image?: string;
  role: Role;
  created_by?: mongoose.Types.ObjectId; // user id

  updated_by?: mongoose.Types.ObjectId; // user id
 
  is_deleted: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile extends Document {
  id: string;
  name: string;
  url: string;
  uploaded_by: mongoose.Types.ObjectId; // user id
   createdAt: Date;
  updatedAt: Date;
}



export interface IRefreshToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;

  expires_at: Date;

  ipAddress?: string;
  userAgent?: string;

  browser?: string;
  os?: string;
  device?: string;

  createdAt: Date;
  updatedAt: Date;
}