import { Schema, model } from "mongoose";
import { IBranch } from "./types/types.js";

const branchSchema = new Schema<IBranch>({
  name: { type: String, required: true },
  address: String,
  contact_number: String,
  email: String,
  reg_id: { type: Schema.Types.ObjectId, ref: "Region", required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updated_by: { type: Schema.Types.ObjectId, ref: "User" },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: true });

branchSchema.index({ name: 1, reg_id: 1, is_deleted: 1 }, { unique: true });

export const Branch = model<IBranch>("Branch", branchSchema);