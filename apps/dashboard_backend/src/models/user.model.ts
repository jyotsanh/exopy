import { Schema, model } from "mongoose";
import { IUser } from "./types/types.js";
import { Role } from "../constant/enum.js";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true, select: false },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: Role, required: true, default: Role.USER },
    profile_image: { type: String },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
    is_deleted: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, is_deleted: 1 }, { unique: true });
userSchema.index({ username: 1, is_deleted: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);