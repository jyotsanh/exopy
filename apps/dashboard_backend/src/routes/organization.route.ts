import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createOrganizationODT,
  updateOrganizationODT,
  organizationIdParamODT,
} from "../validators/organization.validator.js";
import authMiddleware from "../middlewares/auth/authentication.middleware.js";
import { authorization } from "../middlewares/auth/authorization.middleware.js";
import { scopeToOwnOrg } from "../middlewares/auth/scopeToOwnOrg.middleware.js";
import { Role } from "../constants/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router();

router.use(authMiddleware());

router.post(
  "/",
  authorization([Role.SUPERADMIN]),
  validateRequest(createOrganizationODT),
  catchAsync(OrganizationController.create)
);

router.get(
  "/",
  authorization([Role.SUPERADMIN]),
  catchAsync(OrganizationController.getAll)
);

router.get(
  "/:id",
  validateRequest(organizationIdParamODT, "params"),
  scopeToOwnOrg("id"),
  catchAsync(OrganizationController.getById)
);

router.put(
  "/:id",
  validateRequest(organizationIdParamODT, "params"),
  scopeToOwnOrg("id"),
  validateRequest(updateOrganizationODT),
  catchAsync(OrganizationController.update)
);

router.delete(
  "/:id",
  authorization([Role.SUPERADMIN]),
  validateRequest(organizationIdParamODT, "params"),
  catchAsync(OrganizationController.delete)
);

export default router;
