import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {
  IJwtPayload,
  IRefreshTokenPayload,
} from "../interface/jwt.interface.js";
import HttpException from "./httpException.utils.js";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;

export const generateAccessToken = (payload: { id: string; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: { id: string }) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    !("id" in decoded) ||
    !("role" in decoded)
  ) {
    throw HttpException.unauthorized("Invalid token payload");
  }

  return decoded as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IRefreshTokenPayload => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

  if (typeof decoded !== "object" || !("id" in decoded)) {
    throw HttpException.unauthorized("Invalid refresh token payload");
  }

  return decoded as IRefreshTokenPayload;
};

export const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

