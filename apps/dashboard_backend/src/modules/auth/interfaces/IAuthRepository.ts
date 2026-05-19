import type { IUser } from "../../../models/types/index.js";
import type { IRefreshToken } from "../../../models/types/index.js";
import type { Role } from "../../../constants/enum.js";
import type { deviceInfo } from "../types/index.js";

export interface IAuthRepository {
  // User operations
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  createUser(
    username: string,
    email: string,
    hashedPassword: string,
    role: Role
  ): Promise<IUser>;

  // Token operations
  createRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date,
    deviceInfo?: deviceInfo
  ): Promise<IRefreshToken>;
  findRefreshToken(token: string, userId: string): Promise<IRefreshToken | null>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteOtherUserTokens(userId: string, currentToken: string): Promise<void>;
}