import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

const SidebarLogo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-center gap-2.5 px-2 py-2">
            <img src="./Logo.png" alt="Logo" className="w-8 h-8" />
          {!isCollapsed && (
            <span className="font-bold text-lg text-sidebar-foreground tracking-tight">
              Exopy
            </span>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarLogo;