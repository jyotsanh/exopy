import { LayoutDashboard, Building2, Shield } from "lucide-react";
import type { NavGroup, NavItem } from "@/components/theme/sidebar/SidebarNav";
import { paths } from "@/utils/path";
import { useAppSelector } from "@/store/hook/hook";
import { Role } from "@/const/enum";

interface RoleGatedNavItem extends NavItem {
  allowedRoles?: Role[];
}

interface RoleGatedNavGroup {
  title: string;
  items: RoleGatedNavItem[];
}

const RAW_GROUPS: RoleGatedNavGroup[] = [
  {
    title: "Views",
    items: [
      {
        icon: LayoutDashboard,
        label: paths.views.dashboard.label,
        path: paths.views.dashboard.path,
        description: "Overview of key metrics",
      },
    ],
  },
  {
    title: "Control",
    items: [
      {
        icon: Building2,
        label: paths.controls.organization.label,
        path: paths.controls.organization.path,
        description: "Organization control",
      },
      {
        icon: Shield,
        label: paths.controls.admins.label,
        path: paths.controls.admins.path,
        description: "Manage organization admins",
        allowedRoles: [Role.SuperAdmin],
      },
    ],
  },
];

export const useNavigation = () => {
  const role = useAppSelector((state) => state.auth.user?.role) as
    | Role
    | undefined;

  const navGroups: NavGroup[] = RAW_GROUPS.map((group) => ({
    title: group.title,
    items: group.items
      .filter(
        (item) =>
          !item.allowedRoles ||
          (role !== undefined && item.allowedRoles.includes(role))
      )
      .map(({ allowedRoles: _ignored, ...rest }) => rest),
  })).filter((group) => group.items.length > 0);

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
