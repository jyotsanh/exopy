import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  updateAdminODT,
  resetAdminPasswordODT,
  adminIdParamODT,
} from "../validators/admin.validator.js";
import authMiddleware from "../middlewares/auth/authentication.middleware.js";
import { authorization } from "../middlewares/auth/authorization.middleware.js";
import { Role } from "../constants/enum.js";
import { catchAsync } from "../utils/catchAsync.utils.js";

const router = Router();

router.use(authMiddleware());
router.use(authorization([Role.SUPERADMIN]));

router.get("/", catchAsync(AdminController.getAll));

router.get(
  "/:id",
  validateRequest(adminIdParamODT, "params"),
  catchAsync(AdminController.getById)
);

router.put(
  "/:id",
  validateRequest(adminIdParamODT, "params"),
  validateRequest(updateAdminODT),
  catchAsync(AdminController.update)
);

router.post(
  "/:id/reset-password",
  validateRequest(adminIdParamODT, "params"),
  validateRequest(resetAdminPasswordODT),
  catchAsync(AdminController.resetPassword)
);

router.delete(
  "/:id",
  validateRequest(adminIdParamODT, "params"),
  catchAsync(AdminController.delete)
);

export default router;
