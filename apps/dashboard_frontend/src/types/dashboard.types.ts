// ─── Stat Card Types 

export interface Stat {
  label: string;
  value: number;
  sub: string;
  up?: boolean;
  highlight?: boolean;
}

// ─── Analytics Types 

export interface AnalyticsData {
  day: string;
  val: number;
  active?: boolean;
}

// ─── Team Types 

export type TaskStatus = "Completed" | "In Progress" | "Pending";

export interface TeamMember {
  name: string;
  task: string;
  status: TaskStatus;
  initials: string;
  color: string;
  avatar?: string;
}

// ─── Project Types 
export interface Project {
  name: string;
  due: string;
  dot: string;
}

// ─── Reminder Types 

export interface Reminder {
  title: string;
  time: string;
  type: "meeting" | "task" | "event";
}

// ─── Progress Types 

export interface ProgressLegend {
  label: string;
  cls: string;
}

// ─── User Types 

export interface User {
  name: string;
  email: string;
  initials: string;
  avatar?: string;
}