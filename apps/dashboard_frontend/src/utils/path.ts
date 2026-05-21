export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
    label: "Home",
  },

  auth: {
    login: {
      path: "/login",
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    label: "Login",
  },
  controls: {
    organization: {
      path: "/organization",
      getHref: () => "/organization",
      label: "Organization",
    },
    regions: {
      path: "/organization/:orgId/regions",
      getHref: (orgId: string) => `/organization/${orgId}/regions`,
      label: "Regions",
    },
    branches: {
      path: "/organization/:orgId/regions/:regionId/branches",
      getHref: (orgId: string, regionId: string) =>
        `/organization/${orgId}/regions/${regionId}/branches`,
      label: "Branches",
    },
  },
  views: {
    dashboard: {
      path: "/dashboard",
      getHref: () => "/dashboard",
      label: "Dashboard",
    },
    chats: {
      path: "/chats",
      getHref: () => "/chats",
      label: "Chats",
    },
    visitors: {
      path: "/visitors",
      getHref: () => "/visitors",
      label: "Visitors",
    },
    leads: {
      path: "/leads",
      getHref: () => "/leads",
      label: "Leads",
    },
    agentAnalytics: {
      path: "/agent-analytics",
      getHref: () => "/agent-analytics",
      label: "Agent Analytics",
    },
    query: {
      path: "/query",
      getHref: () => "/query",
      label: "Query",
    },
    profile: {
      path: "/profile",
      getHref: () => "/profile",
      label: "Profile",
    },
    googleCalendar: {
      path: "/google-calendar",
      getHref: () => "/google-calendar",
      label: "Google Calendar",
    },
  },
  settings:{
    agent:{
      path: "/agent",
      getHref: () => "/agent",
      label: "Agent",
    },
    department:{
      path: "/department",
      getHref: () => "/department",
      label: "Department",
    },
    account:{
      path: "/account",
      getHref: () => "/account",
      label: "Account",
    },
platform: {
      path: "/platform",
      getHref: () => "/platform",
      label: "Platform",
    },
    automation: {
      path: "/automation",
      getHref: () => "/automation",
      label: "Automation",
    },
    campaign: {
      path: "/campaign",
      getHref: () => "/campaign",
      label: "Campaign",
    },
  }
} as const;
