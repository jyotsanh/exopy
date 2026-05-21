import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createOrganizationODT,
  updateOrganizationODT,
  organizationIdParamODT,
  paginationQueryODT,
} from "../validators/organization.validator.js";
import authMiddleware from "../middlewares/auth/authentication.middleware.js";
import { authorization } from "../middlewares/auth/authorization.middleware.js";
import { Role } from "../constants/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router();

router.use(authMiddleware());

router.post(
  "/",
  authorization([Role.SUPERADMIN, Role.ADMIN]),
  validateRequest(createOrganizationODT),
  catchAsync(OrganizationController.create)
);

router.get(
  "/",
  catchAsync(OrganizationController.getAll)
);

router.get(
  "/:id",
  validateRequest(organizationIdParamODT, "params"),
  catchAsync(OrganizationController.getById)
);

router.put(
  "/:id",
  authorization([Role.SUPERADMIN, Role.ADMIN]),
  validateRequest(organizationIdParamODT, "params"),
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