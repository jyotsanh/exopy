import bcrypt from "bcrypt";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import type { IUser } from "../../../models/types/index.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { deviceInfo, IAuthResponse } from "../types/index.js";
import {
  daysToMs,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.js";
import HttpException from "../../../utils/httpException.utils.js";
import { Role } from "../../../constants/enum.js";

const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async login(email: string, password: string, deviceInfo?: deviceInfo): Promise<IAuthResponse> {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw HttpException.unauthorized("Invalid credentials.");
    }

    if (user.role !== Role.SUPERADMIN && user.role !== Role.ADMIN) {
      throw HttpException.unauthorized("Invalid credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpException.unauthorized("Invalid credentials.");
    }

    return this.createTokenResponse(user, deviceInfo);
  }

  async register(
    username: string,
    email: string,
    password: string,
    orgId: string
  ) {
    const orgExists = await this.repository.organizationExists(orgId);
    if (!orgExists) {
      throw HttpException.badRequest("Organization not found.");
    }

    const existingUser = await this.repository.findUserByEmail(email);
    if (existingUser) {
      throw HttpException.badRequest("Email is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.repository.createUser(
      username,
      email,
      hashedPassword,
      Role.ADMIN,
      orgId
    );

    return {
      success: true,
      message: "Admin registered successfully",
    };
  }

  async refreshToken(tokenFromCookie: string) {
    if (!tokenFromCookie) {
      throw HttpException.unauthorized("No refresh token provided");
    }

    const decoded = verifyRefreshToken(tokenFromCookie);

    const storedToken = await this.repository.findRefreshToken(
      tokenFromCookie,
      decoded.id
    );

    if (!storedToken) {
      throw HttpException.unauthorized("Invalid or expired refresh token");
    }

    if (storedToken.expires_at < new Date()) {
      throw HttpException.unauthorized("Refresh token expired");
    }

    const user = await this.repository.findUserById(decoded.id);
    if (!user || user.is_deleted) {
      throw HttpException.notFound("User not found");
    }

    const newAccessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
      org_id: user.org_id?.toString(),
    });

    return { accessToken: newAccessToken, user };
  }

  async logout(tokenFromCookie?: string) {
    if (tokenFromCookie) {
      await this.repository.deleteRefreshToken(tokenFromCookie);
    }
    return { success: true, message: "Logged out successfully" };
  }

  async forgotPassword(email: string) {
    const user = await this.repository.findUserByEmail(email);

    if (user && !user.is_deleted) {
      await this.repository.invalidateUserPasswordResetTokens(user._id.toString());

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

      await this.repository.createPasswordResetToken(
        token,
        user._id.toString(),
        expiresAt
      );

      // Email sending is out of scope per plan. Log token for development.
      // In production this would dispatch through an email provider.
      console.log(
        `[password-reset] Token for ${user.email}: ${token} (expires ${expiresAt.toISOString()})`
      );
    }

    return {
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.repository.findPasswordResetToken(token);

    if (!record || record.used) {
      throw HttpException.badRequest("Invalid or expired reset token.");
    }

    if (record.expires_at < new Date()) {
      throw HttpException.badRequest("Reset token has expired.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.repository.updateUserPassword(
      record.user.toString(),
      hashedPassword
    );
    await this.repository.markPasswordResetTokenUsed(
      (record as any)._id.toString()
    );
    await this.repository.deleteAllUserRefreshTokens(record.user.toString());

    return {
      success: true,
      message: "Password reset successfully. Please log in with your new password.",
    };
  }

  getDeviceInfo(userAgent?: string, ipAddress?: string): deviceInfo {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      userAgent: userAgent || "unknown",
      ipAddress: ipAddress || "unknown",
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      device: result.device.type || "desktop",
    };
  }

   async createTokenResponse(
    user: IUser,
    deviceInfo?: deviceInfo
  ): Promise<IAuthResponse> {
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
      org_id: user.org_id?.toString(),
    });
    const refreshToken = generateRefreshToken({ id: user._id.toString() });

    await this.repository.createRefreshToken(
      refreshToken,
      user._id.toString(),
      new Date(Date.now() + daysToMs(7)),
      deviceInfo
    );

    await this.repository.deleteOtherUserTokens(
      user._id.toString(),
      refreshToken
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        org_id: user.org_id?.toString(),
        profile_image: user.profile_image,
      },
    };
  }
}