import {
  User,
  Enquiry,
  Project,
  Task,
  TeamGroup,
  DailyWorkReport,
  AttendanceRecord,
  Invoice,
  PaymentRecord,
  NotificationItem,
  ProjectDocument,
} from "@/types";

export const DEFAULT_PERMISSIONS = {
  viewTasks: true,
  createTasks: true,
  editTasks: true,
  updateStatus: true,
  submitWork: true,
  viewAssignedProjects: true,
  viewProjectDetails: true,
  submitDailyReport: true,
  checkIn: true,
  checkOut: true,
  viewFinance: false,
  manageUsers: false,
  systemSettings: false,
};

export const ADMIN_PERMISSIONS = {
  viewTasks: true,
  createTasks: true,
  editTasks: true,
  updateStatus: true,
  submitWork: true,
  viewAssignedProjects: true,
  viewProjectDetails: true,
  submitDailyReport: true,
  checkIn: true,
  checkOut: true,
  viewFinance: true,
  manageUsers: true,
  systemSettings: true,
};

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-1",
    fullName: "Tamil Selvan R",
    email: "ceittamilselvanr@gmail.com",
    username: "tamilselvanr",
    phone: "+91 98765 43210",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    status: "Active",
    lastActive: "Just now",
    permissions: { ...ADMIN_PERMISSIONS },
  },
  {
    id: "usr-admin-2",
    fullName: "Jeevanandham",
    email: "imjeeva08@gmail.com",
    username: "imjeeva08",
    phone: "+91 98765 43211",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    status: "Active",
    lastActive: "Just now",
    permissions: { ...ADMIN_PERMISSIONS },
  },
  {
    id: "usr-admin-3",
    fullName: "Bharath Vishal ",
    email: "vishalbharath566@gmail.com",
    username: "vishalbharath566",
    phone: "+91 98765 43212",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    status: "Active",
    lastActive: "Just now",
    permissions: { ...ADMIN_PERMISSIONS },
  },
];

// Clean Production-Ready Empty Collections
export const INITIAL_ENQUIRIES: Enquiry[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_DAILY_REPORTS: DailyWorkReport[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_PAYMENTS: PaymentRecord[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_PROJECT_DOCUMENTS: ProjectDocument[] = [];
export const INITIAL_TEAMS: TeamGroup[] = [];
