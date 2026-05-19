import type { Request, Response } from "express";
import { OrganizationService } from "../services/organization.service.js";
import { StatusCodes } from "../constant/statusCode.js";
import HttpException from "../utils/httpException.utils.js";
import { z } from "zod";
import { organizationIdParamODT, paginationQueryODT } from "../validators/organization.validator.js";
export const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T =>
  schema.parse(params);


export class OrganizationController {
  static async create(req: Request, res: Response) {
    const { name, email, address, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id ; 

    const result = await OrganizationService.create(
      { name, email, address, contact_number },
      userId
    );

    res.status(StatusCodes.CREATED).json(result);
  }

  static async getAll(req: Request, res: Response) {
const { page, limit, search } = parseParams(paginationQueryODT, req.query);
    const result = await OrganizationService.getAll({ page, limit, search });

    res.status(StatusCodes.SUCCESS).json(result);
  }

static async getById(req: Request, res: Response) {
const { id } = parseParams(organizationIdParamODT, req.params);
  const result = await OrganizationService.getById(id);

  res.status(StatusCodes.SUCCESS).json(result);
}

  static async update(req: Request, res: Response) {
    const { id } = parseParams(organizationIdParamODT, req.params);
    const { name, email, address, contact_number } = req.body;
    if (!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await OrganizationService.update(
      id,
      { name, email, address, contact_number },
      userId
    );

    res.status(StatusCodes.SUCCESS).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { id } = parseParams(organizationIdParamODT, req.params);
    if(!req.user || !req.user._id) {
      throw HttpException.unauthorized("User not authenticated");
    }
    const userId = req.user._id;

    const result = await OrganizationService.delete(id, userId);

    res.status(StatusCodes.SUCCESS).json(result);
  }
}