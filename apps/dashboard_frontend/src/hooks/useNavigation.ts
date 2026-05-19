import { LayoutDashboard, Settings, HelpCircle } from "lucide-react";
import type { NavGroup } from "@/components/theme/sidebar/SidebarNav";
import { paths } from "@/utils/path";

export const useNavigation = () => {
  const navGroups: NavGroup[] = [
    {
      title: "Control",
      items: [
        {
          icon: LayoutDashboard,
          label: paths.controls.organization.label,
          path: paths.controls.organization.path,
          description: "organization control",
        },
      ],
    },
    {
      title: "Views",
      items: [
        {
          icon: Settings,
          label: paths.views.dashboard.label,
          path: paths.views.dashboard.path,
          description: "Update your account and application settings",
        },
        {
          icon: HelpCircle,
          label: paths.views.chats.label,
          path: paths.views.chats.path,
          description: "Get assistance and support resources",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          icon: Settings,
          label: paths.settings.agent.label,
          path: paths.settings.agent.path,
          description: "Update your account and application settings",
        },
        {
          icon: HelpCircle,
          label: paths.settings.department.label,
          path: paths.settings.department.path,
          description: "Get assistance and support resources",
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
