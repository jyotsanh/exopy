import { Schema, model } from "mongoose";
import { IOrganization } from "./types/index.js";

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true},
  address: String,
  contact_number: String,
  email: { type: String, required: true, unique: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },   // add new field reminder for me and other 

}, { timestamps: true });

organizationSchema.index({ email: 1, is_deleted: 1 }, { unique: true });

export const Organization = model<IOrganization>("Organization", organizationSchema);