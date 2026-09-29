export type UserRole =
  | 'Admin'
  | 'Project Manager'
  | 'Developer'
  | 'Designer'
  | 'Backend Developer'
  | 'Frontend Developer'
  | 'SEO'
  | 'Content'
  | 'Accountant'
  | 'Other';

export type UserTeam = 'Development' | 'Design' | 'SEO' | 'Marketing' | 'Content' | 'Management';

export interface UserPermissions {
  // Tasks
  viewTasks: boolean;
  createTasks: boolean;
  editTasks: boolean;
  updateStatus: boolean;
  submitWork: boolean;
  // Projects
  viewAssignedProjects: boolean;
  viewProjectDetails: boolean;
  // Daily Work
  submitDailyReport: boolean;
  // Attendance
  checkIn: boolean;
  checkOut: boolean;
  // Finance
  viewFinance: boolean;
  // Admin
  manageUsers: boolean;
  systemSettings: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  team: UserTeam;
  avatarUrl: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  permissions: UserPermissions;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type EnquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface EnquiryActivity {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface EnquiryNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface EnquiryFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export interface Enquiry {
  id: string;
  clientName: string;
  company: string;
  requirement: string;
  estimatedBudget: number;
  source: string;
  assignedTo: string; // User ID
  assignedToName: string;
  priority: EnquiryPriority;
  status: EnquiryStatus;
  createdDate: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  projectType: string;
  services: string[];
  description: string;
  expectedTimeline: string;
  nextFollowUp: string;
  activities: EnquiryActivity[];
  notes: EnquiryNote[];
  files: EnquiryFile[];
}

export type ProjectStatus = 'In Progress' | 'At Risk' | 'Completed' | 'Planning' | 'On Hold';

export interface Milestone {
  id: string;
  title: string;
  progressPct: number;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  managerId: string;
  managerName: string;
  teamMembers: string[]; // User IDs
  teamMemberNames: string[];
  progressPct: number;
  deadline: string;
  status: ProjectStatus;
  priority: 'Low' | 'Medium' | 'High';
  budget: number;
  milestones: Milestone[];
  description: string;
}

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN PROGRESS' | 'IN REVIEW' | 'CHANGES REQUESTED' | 'COMPLETED';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface TaskActivity {
  id: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  taskKey: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedTo: string; // User ID
  assignedToName: string;
  assignedToAvatar: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  isBlocked?: boolean;
  blockReason?: string;
  checklist: ChecklistItem[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  activities: TaskActivity[];
}

export interface TeamGroup {
  id: string;
  name: UserTeam;
  teamLeadId: string;
  teamLeadName: string;
  memberIds: string[];
  description: string;
}

export interface DailyWorkReport {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  completedTasks: string[];
  inProgressTasks: string[];
  blockedTasks: { taskTitle: string; reason: string }[];
  startTime: string;
  breakMinutes: number;
  currentHours: string;
  tomorrowPlan: string;
  notes: string;
  status: 'Submitted' | 'Pending';
  submittedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  status: 'Present' | 'Leave' | 'Late' | 'Half Day';
  checkInTime: string;
  checkOutTime?: string;
  breakStatus: 'Working' | 'On Break' | 'Checked Out';
  workingHours: string;
}

export type InvoiceStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  projectName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: InvoiceStatus;
  issueDate: string;
  items?: DocumentItem[];
  subtotal?: number;
  taxPercent?: number;
  taxAmount?: number;
  notes?: string;
  // Template specific references matching real invoice structure:
  quotationTotal?: number;
  previousPayment?: number;
  thisInvoiceAmount?: number;
  balanceAfterInvoice?: number;
  milestoneDescription?: string;
}

export interface PaymentRecord {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'task' | 'finance' | 'enquiry' | 'team';
}

export type ProjectDocumentType = 'Quotation' | 'Service Agreement';
export type ProjectDocumentStatus = 'Draft' | 'Sent' | 'Accepted' | 'Signed' | 'Expired';

export interface DocumentItem {
  id: string;
  description: string;
  deliverable?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ScopeSection {
  title: string;
  points: string[];
}

export interface TimelinePhase {
  phase: string;
  timeline: string;
}

export interface DeliveryPlanDay {
  day: string;
  work: string;
}

export interface PricingModule {
  serviceDescription: string;
  deliverablesIncluded?: string;
  price: number;
}

export interface PaymentMilestone {
  name: string;
  percentage?: number;
  amount: number;
  dueWhen: string;
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface ProjectDocument {
  id: string;
  docNumber: string; // e.g. QUO-2026-042 or TSDEV-MAT-2026-002
  type: ProjectDocumentType;
  title: string;
  subtitle?: string;
  slogan?: string;
  projectId: string;
  projectName: string;
  clientId?: string;
  clientName: string;
  businessName?: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  createdDate: string;
  validUntil: string;
  effectiveDate?: string;
  status: ProjectDocumentStatus;
  currency: string;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  items: DocumentItem[];
  paymentTerms: string;
  scopeOfWork: string;
  termsAndConditions: string[];
  preparedBy: string;
  authorizedSignatory: string;
  notes?: string;
  // Rich Template Properties:
  estimatedTimeline?: string;
  quotationRange?: string;
  proposalOverview?: string;
  scopeSections?: ScopeSection[];
  deliverablesList?: string[];
  timelinePhases?: TimelinePhase[];
  deliveryPlanDays?: DeliveryPlanDay[];
  pricingBreakdown?: PricingModule[];
  paymentMilestones?: PaymentMilestone[];
  outOfScopeTerms?: string[];
  importantTerms?: string[];
  bankDetails?: BankDetails;
}

export interface ClientRecord {
  id: string;
  companyName: string;
  primaryContact: string;
  email: string;
  phone: string;
  category: string;
  assignedManager: string;
  totalProjects: number;
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  status: "Active" | "Inactive";
  address?: string;
  createdAt?: string;
}

export interface ExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  projectName: string;
  submittedBy: string;
  status: "Approved" | "Pending" | "Rejected";
  receiptUrl?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: "Client Requirement" | "Technical Note" | "Meeting Minutes" | "Internal Policy" | "General Info";
  author: string;
  isPinned: boolean;
  date: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: "Policy Update" | "Holiday Notice" | "Project Kickoff" | "Client Feedback" | "Team Announcements";
  priority: "High" | "Medium" | "Low";
  targetDepartment: string;
  publishedDate: string;
  author: string;
  acknowledgements: number;
}

export interface FollowUpItem {
  id: string;
  leadId?: string;
  leadName: string;
  businessName: string;
  contactNumber: string;
  type: "Phone Call" | "WhatsApp" | "Email" | "Video Call" | "Site Visit" | "In-Person" | "Meeting" | "Demo";
  scheduledDate: string;
  scheduledTime: string;
  assignedTo: string;
  purpose: string;
  status: "Scheduled" | "Completed" | "Overdue" | "Rescheduled";
  notes?: string;
}


