import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarNavProps {
  groups: NavGroup[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ groups }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title} className="">
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label} className="relative">
                    {isActive && !isCollapsed && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-2 rounded-r-full bg-primary z-10 pointer-events-none"
                        aria-hidden="true"
                      />
                    )}
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                      size="lg"
                      className={cn(
                        "pl-4 transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                          : "hover:bg-muted",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive
                            ? "text-green-600 "
                            : "text-muted-foreground",
                        )}
                      />
                      {!isCollapsed && (
                        <span
                          className={
                            isActive ? "text-black" : "text-muted-foreground"
                          }
                        >
                          {item.label}
                        </span>
                      )}
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge
                        className={cn(
                          isActive ? "bg-primary text-primary-foreground ": "bg-gray-200 text-muted-foreground",
                        )}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNav;
