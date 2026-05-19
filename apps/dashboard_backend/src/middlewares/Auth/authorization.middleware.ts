import { type NextFunction, type Request, type Response } from "express";
import HttpException from "../../utils/httpException.utils.js";
import { Role } from "../../constant/enum.js";
import { IJwtPayload } from "../../interface/jwt.interface.js";

export const authorization = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("Authorizing user with role:", (req.user as IJwtPayload)?.role);
    if (!req.user) return next(HttpException.forbidden("Access forbidden"));

    const userRole = req.user.role as Role;
    if (!roles.includes(userRole)) {
      return next(HttpException.forbidden("Access forbidden"));
    }
    next();
  };
};