import type { NextFunction, Request, Response } from "express";
import HttpException from "../../utils/httpException.utils.js";
import { Role } from "../../constants/enum.js";

/**
 * Allows superadmin unconditionally; allows admin only when the org id
 * in the URL matches the admin's own org_id from the JWT.
 */
export const scopeToOwnOrg =
  (paramName: string = "orgId") =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(HttpException.unauthorized("User not authenticated"));
    }

    if (req.user.role === Role.SUPERADMIN) {
      return next();
    }

    if (req.user.role !== Role.ADMIN) {
      return next(HttpException.forbidden("Access forbidden"));
    }

    const targetOrgId = req.params[paramName];
    if (!targetOrgId) {
      return next(HttpException.badRequest(`Missing ${paramName} in route`));
    }

    if (!req.user.org_id || req.user.org_id !== targetOrgId) {
      return next(
        HttpException.forbidden("You can only access your own organization")
      );
    }

    next();
  };
