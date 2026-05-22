import Layout from "@/components/layout/Layout";
import Login from "@/pages/auth/login";
import ForgotPassword from "@/pages/auth/forgotPassword";
import ResetPassword from "@/pages/auth/resetPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import PagenotFound from "@/pages/pagenotfound/PagenotFound";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import AlreadyAuthenticateRoute from "./AlreadyAuthenticateRoute";
import RoleRoute from "./RoleRoute";
import AuthCallback from "@/pages/oauth/AuthCallback";
import { paths } from "@/utils/path";
import Organization from "@/features/organization/Organization";
import Region from "@/features/region/Region";
import Branch from "@/features/branch/Branch";
import Admins from "@/features/admins/Admins";
import { Role } from "@/const/enum";

function Router() {
  const routes = [
    {
      path: paths.auth.login.path,
      element: (
        <AlreadyAuthenticateRoute>
          <Login />
        </AlreadyAuthenticateRoute>
      ),
    },
    {
      path: paths.auth.forgotPassword.path,
      element: (
        <AlreadyAuthenticateRoute>
          <ForgotPassword />
        </AlreadyAuthenticateRoute>
      ),
    },
    {
      path: paths.auth.resetPassword.path,
      element: (
        <AlreadyAuthenticateRoute>
          <ResetPassword />
        </AlreadyAuthenticateRoute>
      ),
    },
    {
      path: "/auth/callback",
      element: <AuthCallback />,
    },
    {
      path: "*",
      element: <PagenotFound />,
    },
    {
      path: paths.home.path,
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          element: <Dashboard />,
          index: true,
        },
        {
          path: paths.views.dashboard.path,
          element: <Dashboard />,
          index: true,
        },
        {
          path: paths.controls.organization.path,
          element: <Organization />,
        },
        {
          path: paths.controls.regions.path,
          element: (
            <RoleRoute allowedRoles={[Role.Admin]}>
              <Region />
            </RoleRoute>
          ),
        },
        {
          path: paths.controls.branches.path,
          element: (
            <RoleRoute allowedRoles={[Role.Admin]}>
              <Branch />
            </RoleRoute>
          ),
        },
        {
          path: paths.controls.admins.path,
          element: (
            <RoleRoute allowedRoles={[Role.SuperAdmin]}>
              <Admins />
            </RoleRoute>
          ),
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
