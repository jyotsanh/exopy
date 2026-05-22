import { Router } from "express";
import { RegionController } from "../controllers/region.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createRegionODT,
  updateRegionODT,
  regionIdParamODT,
  regionOrgIdParamODT,
} from "../validators/region.validator.js";
import authMiddleware from "../middlewares/auth/authentication.middleware.js";
import { authorization } from "../middlewares/auth/authorization.middleware.js";
import { scopeToOwnOrg } from "../middlewares/auth/scopeToOwnOrg.middleware.js";
import { Role } from "../constants/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router({ mergeParams: true });

router.use(authMiddleware());
router.use(authorization([Role.ADMIN]));
router.use(scopeToOwnOrg("orgId"));

router.post(
  "/",
  validateRequest(regionOrgIdParamODT, "params"),
  validateRequest(createRegionODT),
  catchAsync(RegionController.create)
);

router.get(
  "/",
  validateRequest(regionOrgIdParamODT, "params"),
  catchAsync(RegionController.getAll)
);

router.get(
  "/:id",
  validateRequest(regionIdParamODT, "params"),
  catchAsync(RegionController.getById)
);

router.put(
  "/:id",
  validateRequest(regionIdParamODT, "params"),
  validateRequest(updateRegionODT),
  catchAsync(RegionController.update)
);

router.delete(
  "/:id",
  validateRequest(regionIdParamODT, "params"),
  catchAsync(RegionController.delete)
);

export default router;
