import type { Request, Response } from "express";
import type { AuthService } from "../services/auth.service.js";
import { daysToMs } from "../../../utils/jwt.js";
import { env } from "../../../config/env.js";
import { StatusCodes } from "../../../constants/statusCode.js";


export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const deviceInfo = this.authService.getDeviceInfo(userAgent, ipAddress);

    const result = await this.authService.login(email, password, deviceInfo);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: daysToMs(7),
    });

    res.status(StatusCodes.SUCCESS).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  register = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;
    const response = await this.authService.register(
      username,
      email,
      password,
      role
    );
    res.status(StatusCodes.CREATED).json(response);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken: tokenFromCookie } = req.cookies;

    const result = await this.authService.refreshToken(tokenFromCookie);

    res.status(StatusCodes.SUCCESS).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
      user: {
        id: result.user._id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
      },
    });
  };

  logout = async (req: Request, res: Response) => {
    const { refreshToken: tokenFromCookie } = req.cookies;

    await this.authService.logout(tokenFromCookie);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    });

    res.status(StatusCodes.SUCCESS).json({
      success: true,
      message: "Logged out successfully",
    });
  };
}