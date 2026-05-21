import type {
  Stat,
  AnalyticsData,
  TeamMember,
  Project,
  Reminder,
  ProgressLegend,
} from "@/types/dashboard.types";

// ─── Stats Data 

export const statsData: Stat[] = [
  {
    label: "Total Projects",
    value: 400,
    sub: "Increased from last month",
    up: true,
    highlight: true,
  },
  {
    label: "Ended Projects",
    value: 100,
    sub: "Increased from last month",
    up: true,
  },
  {
    label: "Running Projects",
    value: 120,
    sub: "Increased from last month",
    up: true,
  },
  {
    label: "Pending Project",
    value: 20,
    sub: "On Discuss",
  },
];

// ─── Analytics Data

export const analyticsData: AnalyticsData[] = [
  { day: "S", val: 42 },
  { day: "M", val: 68 },
  { day: "T", val: 74, active: true },
  { day: "W", val: 55 },
  { day: "T", val: 82 },
  { day: "F", val: 47 },
  { day: "S", val: 36 },
];

// ─── Team Data 

export const teamData: TeamMember[] = [
  {
    name: "lav shah",
    task: "Github Project Repository",
    status: "Completed",
    initials: "LS",
    color: "from-emerald-400 to-teal-400",
    avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=lavshah",
  },
  {
    name: "jyotsan hamal",
    task: "Integrate User Authentication System",
    status: "In Progress",
    initials: "JH",
    color: "from-amber-400 to-orange-400",
    avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=jyotsanhamal",
  },
  {
    name: "kush shah",
    task: "Develop Search and Filter Functionality",
    status: "Pending",
    initials: "KS",
    color: "from-violet-400 to-purple-400",
    avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=kushshah",
  },
  {
    name: "Dipesh Ojha",
    task: "Responsive Layout for Homepage",
    status: "In Progress",
    initials: "DO",
    color: "from-sky-400 to-blue-400",
    avatar:"https://api.dicebear.com/9.x/adventurer/svg?seed=dipesh",
  },
];

// ─── Projects Data 

export const projectsData: Project[] = [
  { name: "Develop API Endpoints", due: "Nov 26, 2024", dot: "bg-indigo-500" },
  { name: "Onboarding Flow", due: "Nov 28, 2024", dot: "bg-emerald-500" },
  { name: "Build Dashboard", due: "Nov 30, 2024", dot: "bg-amber-500" },
  { name: "Optimize Page Load", due: "Dec 5, 2024", dot: "bg-rose-500" },
  { name: "Cross-Browser Testing", due: "Dec 6, 2024", dot: "bg-violet-500" },
];

// ─── Reminder Data 

export const reminderData: Reminder = {
  title: "Meeting with Arc Company",
  time: "03:00 pm – 04:00 pm",
  type: "meeting",
};

// ─── Progress Legend Data

export const progressLegendData: ProgressLegend[] = [
  { label: "Completed", cls: "bg-green-700" },
  { label: "In Progress", cls: "bg-green-900" },
  {
    label: "Pending",
    cls: "bg-[repeating-linear-gradient(45deg,#94a3b8,#94a3b8_2px,#e2e8f0_2px,#e2e8f0_5px)]",
  },
];

// ─── User Data 

// export const currentUser: User = {
//   name: "lav shah",
//   email: "lavshah60@mail.com",
//   initials: "LS",
//   avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=lavshah",
// };

// ─── Constants 

export const NOTIFICATION_COUNT = 3;

export const STATUS_STYLES: Record<string, string> = {
  Completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  Pending: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};