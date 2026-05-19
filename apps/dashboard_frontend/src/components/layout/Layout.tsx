import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarLogo from "@/components/theme/sidebar/SidebarLogo";
import SidebarNav from "@/components/theme/sidebar/SidebarNav";
import SidebarUserMenu, {
  type User,
} from "@/components/theme/sidebar/SidebarUserMenu";
// import SidebarPromo from "@/components/theme/sidebar/SidebarPromo"; // [paxi kai kura lai used garna parla ]
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";
import { persistor } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import { clearCredentials, logout } from "@/store/slice/authSlice/authSlice";
import { SEO } from "../seo/SEO";
import AppHeader from "../dashboard/header/AppHeader";
import { NOTIFICATION_COUNT } from "@/data/dashboard.data";

// const dummyNotificationCount = 3;

const Layout = () => {
  // const location = useLocation();
  const { navGroups, findCurrentPage } = useNavigation();
  const currentPage = findCurrentPage(location.pathname);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const User: User = {
    name: user?.username || "",
    email: user?.email || "lavshah51@mail.com",
    initials: user?.username ? user.username.charAt(0).toUpperCase() : "LS",
    avatar:
      user?.profile_image ||
      "https://api.dicebear.com/9.x/adventurer/svg?seed=lavshah",
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCredentials());
    persistor.purge();
  };

  return (
    <SidebarProvider>
      <SEO title={currentPage.title} description={currentPage.description} />
      <Sidebar collapsible="icon">
        {/* Logo */}
        <SidebarHeader>
          {/* <SidebarTrigger className="-ml-1" /> */}
          <SidebarLogo />
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className={cn("p-2")}>
          <SidebarNav groups={navGroups} />
        </SidebarContent>

        {/* Promo Card */}
        {/* <SidebarPromo /> */}

        {/* Footer User Menu */}
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarUserMenu
            user={User}
            settingsPath="/settings"
            onLogout={handleLogout}
          />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        <div className="px-10 py-4">
          <AppHeader
            userName={User.name}
            notificationCount={NOTIFICATION_COUNT}
            userEmail={User.email}
            userAvatar={User.avatar}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-4 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
