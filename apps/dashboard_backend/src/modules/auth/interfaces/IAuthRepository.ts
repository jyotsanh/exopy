import type { IUser } from "../../../models/types/index.js";
import type { IRefreshToken } from "../../../models/types/index.js";
import type { IPasswordResetToken } from "../../../models/passwordResetToken.model.js";
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
    role: Role,
    orgId?: string
  ): Promise<IUser>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  organizationExists(orgId: string): Promise<boolean>;

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
  deleteAllUserRefreshTokens(userId: string): Promise<void>;

  // Password reset operations
  createPasswordResetToken(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<IPasswordResetToken>;
  findPasswordResetToken(token: string): Promise<IPasswordResetToken | null>;
  markPasswordResetTokenUsed(id: string): Promise<void>;
  invalidateUserPasswordResetTokens(userId: string): Promise<void>;
}