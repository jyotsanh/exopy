import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { IUser } from "../../../models/types/types.js";
import type { IRefreshToken } from "../../../models/types/types.js";
import type { Role } from "../../../constant/enum.js";
import type { deviceInfo } from "../types/index.js";
import { User } from "../../../models/user.model.js";
import { RefreshToken } from "../../../models/refreshToken.model.js";

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
    role: Role
  ): Promise<IUser> {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
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
}