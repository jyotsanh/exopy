import { Search, Mail, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface AppHeaderProps {
  notificationCount?: number;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}


const AppHeader: React.FC<AppHeaderProps> = ({
  notificationCount = 0,
  userName = "lav shah",
  userEmail = "lavshah60@mail.com",
  userAvatar,
}) => {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
    console.log("userAvatar:", userAvatar);

  return (
    <header className="flex h-24 shrink-0 items-center gap-3  px-4 bg-muted rounded-3xl">
      <SidebarTrigger className="-ml-1" />

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-card border border-border/50 rounded-3xl px-3 py-2 flex-1 max-w-sm">
        <Search className="size-6 text-muted-foreground shrink-0" />
        <Input
          placeholder="Search task"
          className="
    border-0
    outline-none
    ring-0
    ring-offset-0
    shadow-none
    bg-transparent
    h-10
    p-0
    focus:border-0
    focus:outline-none
    focus:ring-0
    focus-visible:ring-0
    focus-visible:ring-offset-0
    text-sm
    placeholder:text-muted-foreground
  "
        />
        <kbd className="pointer-events-none flex h-6 select-none items-center gap-0.5 rounded-md border bg-background px-1.5 font-mono text-md font-medium text-muted-foreground shrink-0 shadow-sm">
          ⌘F
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Action icons */}
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-3xl bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
      >
        <Mail className="size-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-3xl bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground relative cursor-pointer"
      >
        <Bell className="size-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full ring-2 ring-background" />
        )}
      </Button>

      {/* Divider */}
      <div className="h-8 w-px bg-border/60" />

      {/* User profile */}
      <div className="flex items-center gap-3 pl-1">
        <Avatar className="size-12 ring-2 ring-border/50">
          {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
          <AvatarFallback className="text-xs font-semibold bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">{userEmail}</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
