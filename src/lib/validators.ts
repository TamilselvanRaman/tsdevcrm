import { z } from "zod";

// 1. User Validation Schema
export const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(2, "Username is required"),
  phone: z.string().optional().default(""),
  role: z.enum([
    "Admin",
    "Project Manager",
    "Developer",
    "Designer",
    "Backend Developer",
    "Frontend Developer",
    "SEO",
    "Content",
    "Accountant",
    "Other",
  ]),
  team: z.enum(["Development", "Design", "SEO", "Marketing", "Content", "Management"]),
  avatarUrl: z.string().optional().default(""),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  lastActive: z.string().optional().default("Just now"),
  permissions: z
    .object({
      viewTasks: z.boolean().default(true),
      createTasks: z.boolean().default(true),
      editTasks: z.boolean().default(true),
      updateStatus: z.boolean().default(true),
      submitWork: z.boolean().default(true),
      viewAssignedProjects: z.boolean().default(true),
      viewProjectDetails: z.boolean().default(true),
      submitDailyReport: z.boolean().default(true),
      checkIn: z.boolean().default(true),
      checkOut: z.boolean().default(true),
      viewFinance: z.boolean().default(false),
      manageUsers: z.boolean().default(false),
      systemSettings: z.boolean().default(false),
    })
    .partial()
    .optional(),
});

// 2. Enquiry / Lead Validation Schema
export const enquirySchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(2, "Client contact name is required"),
  company: z.string().optional().default(""),
  requirement: z.string().min(3, "Requirement details are required"),
  estimatedBudget: z.number().nonnegative("Budget must be a non-negative number").default(0),
  source: z.string().optional().default("Direct"),
  assignedTo: z.string().optional().default(""),
  assignedToName: z.string().optional().default("Unassigned"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]).default("New"),
  createdDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  phone: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  email: z.string().optional().default(""),
  location: z.string().optional().default(""),
  projectType: z.string().optional().default("Software Development"),
  services: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(""),
  expectedTimeline: z.string().optional().default("30 Days"),
  nextFollowUp: z.string().optional().default(""),
  activities: z.array(z.any()).optional().default([]),
  notes: z.array(z.any()).optional().default([]),
  files: z.array(z.any()).optional().default([]),
  isLocked: z.boolean().optional().default(false),
  stageStatus: z.enum(["Enquiry", "FollowUp", "Client", "Project"]).optional().default("Enquiry"),
  convertedFollowUpId: z.string().optional(),
  convertedClientId: z.string().optional(),
  convertedProjectId: z.string().optional(),
});

// 3. Follow-up Validation Schema
export const followUpSchema = z.object({
  id: z.string().optional(),
  leadId: z.string().optional(),
  leadName: z.string().min(2, "Lead name is required"),
  businessName: z.string().optional().default(""),
  contactNumber: z.string().optional().default(""),
  type: z.enum([
    "Phone Call",
    "WhatsApp",
    "Email",
    "Video Call",
    "Site Visit",
    "In-Person",
    "Meeting",
    "Demo",
  ]).default("Phone Call"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().optional().default("10:00 AM"),
  assignedTo: z.string().optional().default("Unassigned"),
  purpose: z.string().optional().default("General follow-up"),
  status: z.enum(["Scheduled", "Interested", "Ghosting", "Lost", "Completed", "Overdue", "Rescheduled"]).default("Scheduled"),
  notes: z.string().optional().default(""),
  isLocked: z.boolean().optional().default(false),
  convertedClientId: z.string().optional(),
  convertedProjectId: z.string().optional(),
  stageStatus: z.enum(["FollowUp", "Client", "Project"]).optional().default("FollowUp"),
});

// 4. Client Record Validation Schema
export const clientSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(2, "Company name is required"),
  primaryContact: z.string().min(2, "Primary contact name is required"),
  email: z.string().email().or(z.literal("")).default(""),
  phone: z.string().optional().default(""),
  category: z.string().optional().default("Software Development"),
  assignedManager: z.string().optional().default("Unassigned"),
  totalProjects: z.number().default(0),
  totalBilled: z.number().default(0),
  totalCollected: z.number().default(0),
  outstanding: z.number().default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  address: z.string().optional().default(""),
  createdAt: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  sourceEnquiryId: z.string().optional(),
  sourceFollowUpId: z.string().optional(),
  linkedProjectId: z.string().optional(),
  linkedProjectName: z.string().optional(),
  isLocked: z.boolean().optional().default(false),
});

// 5. Project Validation Schema
export const projectSchema = z.object({
  id: z.string().optional(),
  projectCode: z.string().optional(),
  projectName: z.string().min(2, "Project name is required"),
  clientName: z.string().min(2, "Client name is required"),
  managerId: z.string().optional().default(""),
  managerName: z.string().optional().default("Unassigned"),
  teamMembers: z.array(z.string()).optional().default([]),
  teamMemberNames: z.array(z.string()).optional().default([]),
  progressPct: z.number().min(0).max(100).default(0),
  deadline: z.string().optional().default(""),
  status: z.enum(["In Progress", "At Risk", "Completed", "Planning", "On Hold"]).default("Planning"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  budget: z.number().nonnegative().default(0),
  milestones: z.array(z.any()).optional().default([]),
  description: z.string().optional().default(""),
  files: z.array(z.any()).max(2, "Maximum of 2 requirement files allowed").optional().default([]),
  sourceEnquiryId: z.string().optional(),
  sourceClientId: z.string().optional(),
  sourceFollowUpId: z.string().optional(),
});

// 6. Task Validation Schema
export const taskSchema = z.object({
  id: z.string().optional(),
  taskKey: z.string().optional(),
  title: z.string().min(2, "Task title is required"),
  description: z.string().optional().default(""),
  projectId: z.string().optional().default(""),
  projectName: z.string().optional().default(""),
  assignedTo: z.string().optional().default(""),
  assignedToName: z.string().optional().default("Unassigned"),
  assignedToAvatar: z.string().optional().default(""),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  status: z.enum(["BACKLOG", "TODO", "IN PROGRESS", "IN REVIEW", "CHANGES REQUESTED", "COMPLETED"]).default("TODO"),
  dueDate: z.string().optional().default(""),
  estimatedHours: z.number().default(0),
  actualHours: z.number().default(0),
  isBlocked: z.boolean().optional().default(false),
  blockReason: z.string().optional().default(""),
  checklist: z.array(z.any()).optional().default([]),
  comments: z.array(z.any()).optional().default([]),
  attachments: z.array(z.any()).optional().default([]),
  activities: z.array(z.any()).optional().default([]),
});

// 7. Daily Work Report Schema
export const dailyReportSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().optional().default(""),
  memberName: z.string().min(2, "Member name is required"),
  date: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  completedTasks: z.array(z.string()).optional().default([]),
  inProgressTasks: z.array(z.string()).optional().default([]),
  blockedTasks: z.array(z.any()).optional().default([]),
  startTime: z.string().optional().default("09:00 AM"),
  breakMinutes: z.number().default(0),
  currentHours: z.string().optional().default("8.0"),
  tomorrowPlan: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  status: z.enum(["Submitted", "Pending"]).default("Submitted"),
  submittedAt: z.string().optional().default(() => new Date().toISOString()),
});

// 8. Attendance Record Schema
export const attendanceSchema = z.object({
  id: z.string().optional(),
  memberId: z.string().optional().default(""),
  memberName: z.string().min(2, "Member name is required"),
  date: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  status: z.enum(["Present", "Leave", "Late", "Half Day"]).default("Present"),
  checkInTime: z.string().optional().default("09:00 AM"),
  checkOutTime: z.string().optional().default(""),
  breakStatus: z.enum(["Working", "On Break", "Checked Out"]).default("Working"),
  workingHours: z.string().optional().default("0 hrs"),
});

// 9. Invoice Schema
export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(2, "Invoice number is required"),
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().optional().default(""),
  clientAddress: z.string().optional().default(""),
  clientPhone: z.string().optional().default(""),
  projectName: z.string().optional().default(""),
  amount: z.number().nonnegative().default(0),
  paidAmount: z.number().nonnegative().default(0),
  balance: z.number().default(0),
  dueDate: z.string().optional().default(""),
  status: z.enum(["Paid", "Partial", "Pending", "Overdue"]).default("Pending"),
  issueDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  items: z.array(z.any()).optional().default([]),
  subtotal: z.number().optional().default(0),
  taxPercent: z.number().optional().default(0),
  taxAmount: z.number().optional().default(0),
  notes: z.string().optional().default(""),
  quotationTotal: z.number().optional(),
  previousPayment: z.number().optional(),
  thisInvoiceAmount: z.number().optional(),
  balanceAfterInvoice: z.number().optional(),
  milestoneDescription: z.string().optional(),
});

// 10. Project Document Schema (Quotation / Service Agreement)
export const documentSchema = z.object({
  id: z.string().optional(),
  docNumber: z.string().min(2, "Document number is required"),
  type: z.enum(["Quotation", "Service Agreement"]),
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional().default(""),
  slogan: z.string().optional().default(""),
  projectId: z.string().optional().default(""),
  projectName: z.string().optional().default(""),
  clientId: z.string().optional().default(""),
  clientName: z.string().min(2, "Client name is required"),
  businessName: z.string().optional().default(""),
  clientEmail: z.string().optional().default(""),
  clientAddress: z.string().optional().default(""),
  clientPhone: z.string().optional().default(""),
  createdDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  validUntil: z.string().optional().default(""),
  effectiveDate: z.string().optional().default(""),
  status: z.enum(["Draft", "Sent", "Accepted", "Signed", "Expired"]).default("Draft"),
  currency: z.string().default("INR"),
  subtotal: z.number().default(0),
  taxPercent: z.number().default(0),
  taxAmount: z.number().default(0),
  totalAmount: z.number().default(0),
  items: z.array(z.any()).optional().default([]),
  paymentTerms: z.string().optional().default(""),
  scopeOfWork: z.string().optional().default(""),
  termsAndConditions: z.array(z.string()).optional().default([]),
  preparedBy: z.string().optional().default(""),
  authorizedSignatory: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

// 11. Workspace Note Schema
export const noteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Note title is required"),
  content: z.string().min(2, "Note content is required"),
  category: z.enum(["Client Requirement", "Technical Note", "Meeting Minutes", "Internal Policy", "General Info"]).default("General Info"),
  author: z.string().optional().default("System"),
  isPinned: z.boolean().optional().default(false),
  date: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
});

// 12. Notice Board Announcement Schema
export const noticeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Notice title is required"),
  content: z.string().min(2, "Notice content is required"),
  category: z.enum(["Policy Update", "Holiday Notice", "Project Kickoff", "Client Feedback", "Team Announcements"]).default("Team Announcements"),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  targetDepartment: z.string().optional().default("All Staff"),
  publishedDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  author: z.string().optional().default("Management"),
  acknowledgements: z.number().default(0),
});

// 13. Expense Schema
export const expenseSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(2, "Description is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  date: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  projectName: z.string().optional().default("Agency Operations"),
  submittedBy: z.string().optional().default("Admin"),
  status: z.enum(["Approved", "Pending", "Rejected"]).default("Approved"),
  receiptUrl: z.string().optional().default(""),
});

// 14. Team Group Schema
export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.enum(["Development", "Design", "SEO", "Marketing", "Content", "Management"]),
  teamLeadId: z.string().optional().default(""),
  teamLeadName: z.string().optional().default("Unassigned"),
  memberIds: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(""),
});
