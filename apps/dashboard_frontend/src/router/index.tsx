import Layout from "@/components/layout/Layout";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard/Dashboard";
import PagenotFound from "@/pages/pagenotfound/PagenotFound";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import AlreadyAuthenticateRoute from "./AlreadyAuthenticateRoute";
import AuthCallback from "@/pages/oauth/AuthCallback";
import { paths } from "@/utils/path";

// Controls
import Organization from "@/features/organization/Organization";
import Region from "@/features/region/Region";
import Branch from "@/features/branch/Branch";
import PageTemplate from "@/components/template/PageTemplate";
// Views


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
        // ==================
        // Index
        // ==================
        {
          index: true,
          element: <Dashboard />,
        },
        // ==================
        // Controls
        // ==================
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
        // ==================
        // Views
        // ==================
        {
          path: paths.views.dashboard.path,
          element: <Dashboard />,
        },
        {
          path: paths.views.chats.path,
          element: <PageTemplate title="Chats" />,
        },
        {
          path: paths.views.visitors.path,
          element: <PageTemplate title="Visitors" />,
        },
        {
          path: paths.views.leads.path,
          element: <PageTemplate title="Leads" />,
        },
        {
          path: paths.views.agentAnalytics.path,
          element: <PageTemplate title="Agent Analytics" />,
        },
        {
          path: paths.views.query.path,
          element: <PageTemplate title="Query" />,
        },
        {
          path: paths.views.profile.path,
          element: <PageTemplate title="Profile" />,
        },
        {
          path: paths.views.googleCalendar.path,
          element: <PageTemplate title="Google Calendar" />,
        },
        // ==================
        // Settings
        // ==================
        {
          path: paths.settings.agent.path,
          element: <PageTemplate title="Agent" />,
        },
        {
          path: paths.settings.department.path,
          element: <PageTemplate title="Department" />,
        },
        {
          path: paths.settings.account.path,
          element: <PageTemplate title="Account" />,
        },
        {
          path: paths.settings.platform.path,
          element: <PageTemplate title="Platform" />,
        },
        {
          path: paths.settings.automation.path,
          element: <PageTemplate title="Automation" />,
        },
        {
          path: paths.settings.campaign.path,
          element: <PageTemplate title="Campaign" />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;