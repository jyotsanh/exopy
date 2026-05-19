import { Router } from "express";
import { OrganizationController } from "../controllers/organization.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createOrganizationODT,
  updateOrganizationODT,
  organizationIdParamODT,
  paginationQueryODT,
} from "../validators/organization.validator.js";
import authMiddleware from "../middlewares/Auth/authentication.middleware.js";
import { authorization } from "../middlewares/Auth/authorization.middleware.js";
import { Role } from "../constant/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router();

router.use(authMiddleware());
// router.use(authorization([Role.SUPERADMIN]));
router.post(
  "/",
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
  validateRequest(organizationIdParamODT, "params"),
  validateRequest(updateOrganizationODT),
  catchAsync(OrganizationController.update)
);

router.delete(
  "/:id",
  validateRequest(organizationIdParamODT, "params"),
  catchAsync(OrganizationController.delete)
);

export default router;