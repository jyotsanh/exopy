import bcrypt from "bcrypt";
import { UAParser } from "ua-parser-js";
import type { IUser } from "../../../models/types/types.js";
import type { IAuthRepository } from "../interfaces/IAuthRepository.js";
import type { deviceInfo, IAuthResponse } from "../types/index.js";
import {
  daysToMs,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/jwt.js";
import HttpException from "../../../utils/httpException.utils.js";
import { Role } from "../../../constant/enum.js";

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async login(email: string, password: string, deviceInfo?: deviceInfo): Promise<IAuthResponse> {
    const user = await this.repository.findUserByEmail(email);
    if (!user) {
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
    role: Role = Role.USER
  ) {
    const existingUser = await this.repository.findUserByEmail(email);
    if (existingUser) {
      throw HttpException.badRequest("Email is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.repository.createUser(username, email, hashedPassword, role);

    return {
      success: true,
      message: "Registration successful",
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
    });

    return { accessToken: newAccessToken, user };
  }

  async logout(tokenFromCookie?: string) {
    if (tokenFromCookie) {
      await this.repository.deleteRefreshToken(tokenFromCookie);
    }
    return { success: true, message: "Logged out successfully" };
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
        profile_image: user.profile_image,
      },
    };
  }
}