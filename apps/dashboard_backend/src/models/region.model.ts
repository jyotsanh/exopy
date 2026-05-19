import { Schema, model } from "mongoose";
import { IRegion } from "./types/types.js";

const regionSchema = new Schema<IRegion>(
  {
    name: { type: String, required: true }, 
    contact_number: String,
    email: String,
    org_id: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    updated_by: { type: Schema.Types.ObjectId, ref: "User" }, 
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

regionSchema.index({ name: 1, org_id: 1, is_deleted: 1 }, { unique: true });

export const Region = model<IRegion>("Region", regionSchema);