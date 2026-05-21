import Layout from "@/components/layout/Layout";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard/Dashboard";
import PagenotFound from "@/pages/pagenotfound/PagenotFound";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import AlreadyAuthenticateRoute from "./AlreadyAuthenticateRoute";
import AuthCallback from "@/pages/oauth/AuthCallback";
import { paths } from "@/utils/path";
import Organization from "@/features/organization/Organization";
import Region from "@/features/region/Region";
import Branch from "@/features/branch/Branch";

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
          element: <Region />,
        },
        {
          path: paths.controls.branches.path,
          element: <Branch />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
