import type { Request, Response } from "express";
import { RegionService } from "../services/region.service.js";
import { StatusCodes } from "../constants/statusCode.js";
import HttpException from "../utils/httpException.utils.js";
import { z } from "zod";
import {
  regionIdParamODT,
  regionOrgIdParamODT,
  regionPaginationQueryODT,
} from "../validators/region.validator.js";

export const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T =>
  schema.parse(params);

export class RegionController {
  static async create(req: Request, res: Response) {
    const { orgId } = parseParams(regionOrgIdParamODT, req.params);
    const { name, email, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await RegionService.create(
      orgId,
      { name, email, contact_number },
      userId
    );

    res.status(StatusCodes.CREATED).json(result);
  }

  static async getAll(req: Request, res: Response) {
    const { orgId } = parseParams(regionOrgIdParamODT, req.params);
    const { page, limit, search } = parseParams(
      regionPaginationQueryODT,
      req.query
    );

    const result = await RegionService.getAll(orgId, { page, limit, search });

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async getById(req: Request, res: Response) {
    const { orgId, id } = parseParams(regionIdParamODT, req.params);
    const result = await RegionService.getById(orgId, id);

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async update(req: Request, res: Response) {
    const { orgId, id } = parseParams(regionIdParamODT, req.params);
    const { name, email, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await RegionService.update(
      orgId,
      id,
      { name, email, contact_number },
      userId
    );

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { orgId, id } = parseParams(regionIdParamODT, req.params);
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await RegionService.delete(orgId, id, userId);

    res.status(StatusCodes.SUCCESS).json(result);
  }
}
