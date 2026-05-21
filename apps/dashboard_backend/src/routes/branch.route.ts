import { Router } from "express";
import { BranchController } from "../controllers/branch.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createBranchODT,
  updateBranchODT,
  branchIdParamODT,
  branchScopeParamODT,
} from "../validators/branch.validator.js";
import authMiddleware from "../middlewares/auth/authentication.middleware.js";
import { authorization } from "../middlewares/auth/authorization.middleware.js";
import { Role } from "../constants/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router({ mergeParams: true });

router.use(authMiddleware());

router.post(
  "/",
  authorization([Role.SUPERADMIN, Role.ADMIN]),
  validateRequest(branchScopeParamODT, "params"),
  validateRequest(createBranchODT),
  catchAsync(BranchController.create)
);

router.get(
  "/",
  validateRequest(branchScopeParamODT, "params"),
  catchAsync(BranchController.getAll)
);

router.get(
  "/:id",
  validateRequest(branchIdParamODT, "params"),
  catchAsync(BranchController.getById)
);

router.put(
  "/:id",
  authorization([Role.SUPERADMIN, Role.ADMIN]),
  validateRequest(branchIdParamODT, "params"),
  validateRequest(updateBranchODT),
  catchAsync(BranchController.update)
);

router.delete(
  "/:id",
  authorization([Role.SUPERADMIN, Role.ADMIN]),
  validateRequest(branchIdParamODT, "params"),
  catchAsync(BranchController.delete)
);

export default router;
