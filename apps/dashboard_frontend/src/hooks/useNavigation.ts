import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  Building2,
  GitBranch,
  Users,
  Layers,
  BarChart2,
  Search,
  User,
  Calendar,
  Globe,
  Zap,
  Megaphone,
  UserCog,
} from "lucide-react";
import type { NavGroup } from "@/components/theme/sidebar/SidebarNav";
import { paths } from "@/utils/path";

export const useNavigation = () => {
  const navGroups: NavGroup[] = [
    // ==================
    // Control
    // ==================
    {
      title: "Control",
      items: [
        {
          icon: Building2,
          label: paths.controls.organization.label,
          path: paths.controls.organization.path,
          description: "Manage your organization",
        },
        {
          icon: GitBranch,
          label: paths.controls.regions.label,
          path: paths.controls.regions.path,
          description: "Manage regions",
        },
        {
          icon: Layers,
          label: paths.controls.branches.label,
          path: paths.controls.branches.path,
          description: "Manage branches",
        },
      ],
    },
    // ==================
    // Views
    // ==================
    {
      title: "Views",
      items: [
        {
          icon: LayoutDashboard,
          label: paths.views.dashboard.label,
          path: paths.views.dashboard.path,
          description: "Overview of your dashboard",
        },
        {
          icon: MessageSquare,
          label: paths.views.chats.label,
          path: paths.views.chats.path,
          description: "Manage and view chats",
        },
        {
          icon: Globe,
          label: paths.views.visitors.label,
          path: paths.views.visitors.path,
          description: "Track and manage visitors",
        },
        {
          icon: Users,
          label: paths.views.leads.label,
          path: paths.views.leads.path,
          description: "Manage your leads",
        },
        {
          icon: BarChart2,
          label: paths.views.agentAnalytics.label,
          path: paths.views.agentAnalytics.path,
          description: "View agent performance analytics",
        },
        {
          icon: Search,
          label: paths.views.query.label,
          path: paths.views.query.path,
          description: "Manage and view queries",
        },
        {
          icon: User,
          label: paths.views.profile.label,
          path: paths.views.profile.path,
          description: "View and edit your profile",
        },
        {
          icon: Calendar,
          label: paths.views.googleCalendar.label,
          path: paths.views.googleCalendar.path,
          description: "Manage your Google Calendar",
        },
      ],
    },
    // ==================
    // Settings
    // ==================
    {
      title: "Settings",
      items: [
        {
          icon: UserCog,
          label: paths.settings.agent.label,
          path: paths.settings.agent.path,
          description: "Manage agents and their settings",
        },
        {
          icon: Layers,
          label: paths.settings.department.label,
          path: paths.settings.department.path,
          description: "Manage departments",
        },
        {
          icon: Settings,
          label: paths.settings.account.label,
          path: paths.settings.account.path,
          description: "Manage your account settings",
        },
        {
          icon: Globe,
          label: paths.settings.platform.label,
          path: paths.settings.platform.path,
          description: "Manage platform settings",
        },
        {
          icon: Zap,
          label: paths.settings.automation.label,
          path: paths.settings.automation.path,
          description: "Manage automation workflows",
        },
        {
          icon: Megaphone,
          label: paths.settings.campaign.label,
          path: paths.settings.campaign.path,
          description: "Manage your campaigns",
        },
      ],
    },
  ];

  const findCurrentPage = (pathname: string) => {
    for (const group of navGroups) {
      const item = group.items.find((item) => item.path === pathname);
      if (item) {
        return {
          title: item.label,
          description: item.description || `${item.label} overview`,
        };
      }
    }
    return { title: "Dashboard", description: "Overview" };
  };

  return { navGroups, findCurrentPage };
};