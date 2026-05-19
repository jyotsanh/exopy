import { Router } from "express";
const router = Router();
import authRoute from "../modules/auth/routes/auth.routes.js";
import organizationRoute from "./organization.route.js";
import { Role } from "../constant/enum.js";

interface Route {
  path: string;
  route: Router;
}
const routes: Route[] = [
  { path: "/auth", route: authRoute },
  { path: "/organizations", route: organizationRoute },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
