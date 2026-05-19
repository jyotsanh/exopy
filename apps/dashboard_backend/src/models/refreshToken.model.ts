import mongoose, { Schema, model } from "mongoose";
import { IRefreshToken } from "./types/types.js";
import { daysToMs } from "../utils/jwt.js";

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + daysToMs(7)),
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    browser: {
      type: String,
    },

    os: {
      type: String,
    },

    device: {
      type: String,
      default: "desktop",
    },
  },
  { timestamps: true },
);

/* TTL index → MongoDB auto deletes expired tokens */
refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

/* useful for queries like: show user active sessions */
refreshTokenSchema.index({ user: 1 });

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
);
