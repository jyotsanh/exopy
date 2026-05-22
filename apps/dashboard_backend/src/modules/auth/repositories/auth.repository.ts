import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { IUser } from "../../../models/types/index.js";
import type { IRefreshToken } from "../../../models/types/index.js";
import type { Role } from "../../../constants/enum.js";
import type { deviceInfo } from "../types/index.js";
import { User } from "../../../models/user.model.js";
import { Organization } from "../../../models/organization.model.js";
import { RefreshToken } from "../../../models/refreshToken.model.js";
import {
  PasswordResetToken,
  type IPasswordResetToken,
} from "../../../models/passwordResetToken.model.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, is_deleted: false }).select("+password");
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async createUser(
    username: string,
    email: string,
    hashedPassword: string,
    role: Role,
    orgId?: string
  ): Promise<IUser> {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      org_id: orgId,
    });
    return newUser.save();
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async organizationExists(orgId: string): Promise<boolean> {
    const org = await Organization.findOne({ _id: orgId, is_deleted: false });
    return !!org;
  }

  async createRefreshToken(
    token: string,
    userId: string,
    expiresAt: Date,
    deviceInfo?: deviceInfo
  ): Promise<IRefreshToken> {
    return RefreshToken.create({
      token,
      user: userId,
      expires_at: expiresAt,
      ...deviceInfo,
    });
  }

  async findRefreshToken(
    token: string,
    userId: string
  ): Promise<IRefreshToken | null> {
    return RefreshToken.findOne({ token, user: userId });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await RefreshToken.deleteOne({ token });
  }

  async deleteOtherUserTokens(
    userId: string,
    currentToken: string
  ): Promise<void> {
    await RefreshToken.deleteMany({
      user: userId,
      token: { $ne: currentToken },
    });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await RefreshToken.deleteMany({ user: userId });
  }

  async createPasswordResetToken(
    token: string,
    userId: string,
    expiresAt: Date
  ): Promise<IPasswordResetToken> {
    return PasswordResetToken.create({
      token,
      user: userId,
      expires_at: expiresAt,
    });
  }

  async findPasswordResetToken(token: string): Promise<IPasswordResetToken | null> {
    return PasswordResetToken.findOne({ token });
  }

  async markPasswordResetTokenUsed(id: string): Promise<void> {
    await PasswordResetToken.findByIdAndUpdate(id, { used: true });
  }

  async invalidateUserPasswordResetTokens(userId: string): Promise<void> {
    await PasswordResetToken.updateMany(
      { user: userId, used: false },
      { used: true }
    );
  }
}