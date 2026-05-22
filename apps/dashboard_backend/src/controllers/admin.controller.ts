import type { Request, Response } from "express";
import { z } from "zod";
import { AdminService } from "../services/admin.service.js";
import { StatusCodes } from "../constants/statusCode.js";
import HttpException from "../utils/httpException.utils.js";
import {
  adminIdParamODT,
  adminPaginationQueryODT,
} from "../validators/admin.validator.js";

const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T =>
  schema.parse(params);

export class AdminController {
  static async getAll(req: Request, res: Response) {
    const { page, limit, search, org_id } = parseParams(
      adminPaginationQueryODT,
      req.query
    );
    const result = await AdminService.getAll({ page, limit, search, org_id });

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async getById(req: Request, res: Response) {
    const { id } = parseParams(adminIdParamODT, req.params);
    const result = await AdminService.getById(id);

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async update(req: Request, res: Response) {
    const { id } = parseParams(adminIdParamODT, req.params);
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const { username, email, profile_image, org_id } = req.body;

    const result = await AdminService.update(
      id,
      { username, email, profile_image, org_id },
      req.user._id
    );

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { id } = parseParams(adminIdParamODT, req.params);
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }

    const result = await AdminService.delete(id, req.user._id);

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async resetPassword(req: Request, res: Response) {
    const { id } = parseParams(adminIdParamODT, req.params);
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const { password } = req.body as { password: string };

    const result = await AdminService.resetPassword(
      id,
      password,
      req.user._id
    );

    res.status(StatusCodes.SUCCESS).json(result);
  }
}
