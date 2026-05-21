import { Router } from "express";
const router = Router();
import authRoute from "../modules/auth/routes/auth.routes.js";
import organizationRoute from "./organization.route.js";
import regionRoute from "./region.route.js";
import branchRoute from "./branch.route.js";

interface Route {
  path: string;
  route: Router;
}
const routes: Route[] = [
  { path: "/auth", route: authRoute },
  { path: "/organizations", route: organizationRoute },
  { path: "/organizations/:orgId/regions", route: regionRoute },
  {
    path: "/organizations/:orgId/regions/:regionId/branches",
    route: branchRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
