import { Request, Response, Router } from "express";

import { authController, authService } from "../container/index.js";
import { validateRequest } from "../../../middlewares/validateRequest.middleware.js";
import { catchAsync } from "../../../utils/catchAsync.utils.js";
import { loginODT, registerODT } from "../../../validators/auth.validator.js";
import passport from "passport";
import { env } from "../../../config/env.js";
import { daysToMs } from "../../../utils/jwt.js";
import authMiddleware from "../../../middlewares/auth/authentication.middleware.js";
import { authorization } from "../../../middlewares/auth/authorization.middleware.js";
import { Role } from "../../../constants/enum.js";
import { User } from "../../../models/user.model.js";

const router = Router();

router.post(
  "/login",
  validateRequest(loginODT),
  catchAsync(authController.login)
);

router.post(
  "/register",
  validateRequest(registerODT),
  catchAsync(authController.register)
);

router.post("/refresh-token", catchAsync(authController.refreshToken));

router.post("/logout", catchAsync(authController.logout));
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/callback?error=auth_failed`,
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user || !user._id) {
        return res.redirect(`${env.CLIENT_URL}/auth/callback?error=no_user`);
      }
      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"];
      const deviceInfo = authService.getDeviceInfo(userAgent, ipAddress);
      const response = await authService.createTokenResponse(user, deviceInfo);
      // Create user data
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: daysToMs(7), // 7 days
      });

      const userDataEncoded = encodeURIComponent(JSON.stringify(response.user));
      res.redirect(
        `${env.CLIENT_URL}/auth/callback?token=${response.accessToken}&user=${userDataEncoded}`,
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${env.CLIENT_URL}/auth/callback?error=server_error`);
    }
  },
);

router.get("/me", authMiddleware(), async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById(req.user._id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
});

router.get(
  "/admin",
  authMiddleware(),
  authorization([Role.ADMIN]),
  (req: Request, res: Response) => {
    res.json({ message: "Welcome, admin!" });
  },
);

export default router;