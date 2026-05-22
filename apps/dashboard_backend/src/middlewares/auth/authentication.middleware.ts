import type { NextFunction, Request, Response } from "express";
import HttpException from "../../utils/httpException.utils.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const authMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(HttpException.unauthorized("NO_TOKEN"));
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);

      req.user = {
        _id: decoded.id.toString(),
        role: decoded.role,
        org_id: decoded.org_id,
      };

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(HttpException.unauthorized("TOKEN_EXPIRED"));
      }

      return next(HttpException.forbidden("INVALID_TOKEN"));
    }
  };

export default authMiddleware;
