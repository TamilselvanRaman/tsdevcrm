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
export const INITIAL_USERS: User[] = [];
