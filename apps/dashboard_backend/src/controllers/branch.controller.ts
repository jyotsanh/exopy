import type { Request, Response } from "express";
import { BranchService } from "../services/branch.service.js";
import { StatusCodes } from "../constants/statusCode.js";
import HttpException from "../utils/httpException.utils.js";
import { z } from "zod";
import {
  branchIdParamODT,
  branchScopeParamODT,
  branchPaginationQueryODT,
} from "../validators/branch.validator.js";

export const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T =>
  schema.parse(params);

export class BranchController {
  static async create(req: Request, res: Response) {
    const { orgId, regionId } = parseParams(branchScopeParamODT, req.params);
    const { name, address, email, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await BranchService.create(
      orgId,
      regionId,
      { name, address, email, contact_number },
      userId
    );

    res.status(StatusCodes.CREATED).json(result);
  }

  static async getAll(req: Request, res: Response) {
    const { orgId, regionId } = parseParams(branchScopeParamODT, req.params);
    const { page, limit, search } = parseParams(
      branchPaginationQueryODT,
      req.query
    );

    const result = await BranchService.getAll(orgId, regionId, {
      page,
      limit,
      search,
    });

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async getById(req: Request, res: Response) {
    const { orgId, regionId, id } = parseParams(branchIdParamODT, req.params);
    const result = await BranchService.getById(orgId, regionId, id);

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async update(req: Request, res: Response) {
    const { orgId, regionId, id } = parseParams(branchIdParamODT, req.params);
    const { name, address, email, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await BranchService.update(
      orgId,
      regionId,
      id,
      { name, address, email, contact_number },
      userId
    );

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { orgId, regionId, id } = parseParams(branchIdParamODT, req.params);
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await BranchService.delete(orgId, regionId, id, userId);

    res.status(StatusCodes.SUCCESS).json(result);
  }
}
