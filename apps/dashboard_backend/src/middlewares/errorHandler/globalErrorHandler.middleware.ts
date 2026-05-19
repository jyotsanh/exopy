import { Request, Response, NextFunction } from "express";
import HttpException from "../../utils/httpException.utils.js";
import { env } from "../../config/env.js";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // log real error (important)
  console.error(err);

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};