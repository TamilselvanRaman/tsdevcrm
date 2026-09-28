import { create } from "zustand";
import {
  User,
  Enquiry,
  Project,
  Task,
  TaskStatus,
  TeamGroup,
  DailyWorkReport,
  AttendanceRecord,
  Invoice,
  PaymentRecord,
  NotificationItem,
  UserPermissions,
  UserRole,
  UserTeam,
  ProjectDocument,
  ProjectDocumentStatus,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_ENQUIRIES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_TEAMS,
  INITIAL_DAILY_REPORTS,
  INITIAL_ATTENDANCE,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECT_DOCUMENTS,
} from "@/lib/mockData";
import {
  subscribeEnquiries,
  saveEnquiry,
  deleteEnquiry,
  subscribeProjects,
  saveProject,
  deleteProject,
  subscribeTasks,
  saveTask,
  deleteTask,
  subscribeUsers,
  saveUser,
  subscribeDailyReports,
  saveDailyReport,
  subscribeAttendance,
  saveAttendance,
  subscribeInvoices,
  saveInvoice,
  subscribeDocuments,
  saveDocument,
  deleteDocument as deleteFirestoreDocument,
  seedFirestoreIfEmpty,
} from "@/lib/firebaseService";

export type PortalMode = "admin" | "team_member";

interface AppState {
  // Auth & Portal State
  isAuthenticated: boolean;
  portalMode: PortalMode;
  currentUserId: string;

  setPortalMode: (mode: PortalMode) => void;
  setCurrentUserId: (id: string) => void;
  loginAsAdmin: () => void;
  loginAsTeamMember: (userId: string) => void;
  logout: () => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Modals & Drawers
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;

  // Firebase Sync
  firebaseSynced: boolean;
  initFirebaseSync: () => () => void;

  // Data Collections
  users: User[];
  enquiries: Enquiry[];
  projects: Project[];
  tasks: Task[];
  teams: TeamGroup[];
  dailyReports: DailyWorkReport[];
  attendance: AttendanceRecord[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  documents: ProjectDocument[];

  // Actions - Documents
  addDocument: (doc: Omit<ProjectDocument, "id">) => void;
  updateDocumentStatus: (id: string, status: ProjectDocumentStatus) => void;
  deleteDocument: (id: string) => void;

  // Actions - Enquiries
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "createdDate" | "activities" | "notes" | "files">) => void;
  updateEnquiryStatus: (id: string, status: Enquiry["status"]) => void;
  assignEnquiry: (id: string, memberId: string, memberName: string) => void;
  addEnquiryNote: (id: string, text: string, author: string) => void;

  // Actions - Projects
  addProject: (project: Omit<Project, "id">) => void;
  updateProjectStatus: (id: string, status: Project["status"]) => void;

  // Actions - Tasks
  addTask: (task: Omit<Task, "id" | "taskKey" | "checklist" | "comments" | "attachments" | "activities" | "actualHours">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskBlock: (id: string, reason?: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  assignTask: (taskId: string, userId: string, userName: string, userAvatar: string) => void;
  addComment: (taskId: string, commentText: string) => void;

  // Actions - Team & Users
  addUser: (user: Omit<User, "id" | "lastActive">) => void;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Actions - Teams Structure
  addTeam: (team: Omit<TeamGroup, "id">) => void;

  // Actions - Daily Work
  submitDailyReport: (report: Omit<DailyWorkReport, "id" | "submittedAt" | "submitted">) => void;

  // Actions - Attendance
  checkIn: (memberId: string) => void;
  startBreak: (memberId: string) => void;
  endBreak: (memberId: string) => void;
  checkOut: (memberId: string) => void;

  // Actions - Invoices
  addInvoice: (invoice: Omit<Invoice, "id">) => void;

  // Actions - Notifications
  markNotificationRead: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: true,
  portalMode: "admin",
  currentUserId: "usr-001", // Tamil Selvan default

  setPortalMode: (mode) => set({ portalMode: mode }),
  setCurrentUserId: (id) => set({ currentUserId: id }),

  loginAsAdmin: () =>
    set({
      isAuthenticated: true,
      portalMode: "admin",
      currentUserId: "usr-001",
    }),

  loginAsTeamMember: (userId) =>
    set({
      isAuthenticated: true,
      portalMode: "team_member",
      currentUserId: userId,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
    }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  notificationDrawerOpen: false,
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),

  firebaseSynced: false,

  initFirebaseSync: () => {
    // Attempt auto-seed if newly created database
    seedFirestoreIfEmpty().catch(() => {});

    // Real-time Firestore Subscriptions
    const unsubEnquiries = subscribeEnquiries((list) => {
      if (list !== undefined && list !== null) set({ enquiries: list });
    });
    const unsubProjects = subscribeProjects((list) => {
      if (list !== undefined && list !== null) set({ projects: list });
    });
    const unsubTasks = subscribeTasks((list) => {
      if (list !== undefined && list !== null) set({ tasks: list });
    });
    const unsubUsers = subscribeUsers((list) => {
      if (list && list.length > 0) set({ users: list });
    });
    const unsubReports = subscribeDailyReports((list) => {
      if (list !== undefined && list !== null) set({ dailyReports: list });
    });
    const unsubAttendance = subscribeAttendance((list) => {
      if (list !== undefined && list !== null) set({ attendance: list });
    });
    const unsubInvoices = subscribeInvoices((list) => {
      if (list !== undefined && list !== null) set({ invoices: list });
    });
    const unsubDocuments = subscribeDocuments((list) => {
      if (list !== undefined && list !== null) set({ documents: list });
    });

    set({ firebaseSynced: true });

    return () => {
      unsubEnquiries();
      unsubProjects();
      unsubTasks();
      unsubUsers();
      unsubReports();
      unsubAttendance();
      unsubInvoices();
      unsubDocuments();
    };
  },

  users: INITIAL_USERS,
  enquiries: INITIAL_ENQUIRIES,
  projects: INITIAL_PROJECTS,
  tasks: INITIAL_TASKS,
  teams: INITIAL_TEAMS,
  dailyReports: INITIAL_DAILY_REPORTS,
  attendance: INITIAL_ATTENDANCE,
  invoices: INITIAL_INVOICES,
  payments: INITIAL_PAYMENTS,
  notifications: INITIAL_NOTIFICATIONS,
  documents: INITIAL_PROJECT_DOCUMENTS,

  // Document Actions
  addDocument: (docData) => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: ProjectDocument = {
      ...docData,
      id: newDocId,
    };
    set((s) => ({
      documents: [newDoc, ...s.documents],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `New ${docData.type} Generated`,
          message: `${docData.docNumber} created for project "${docData.projectName}".`,
          timestamp: "Just now",
          isRead: false,
          type: "finance",
        },
        ...s.notifications,
      ],
    }));
    saveDocument(newDoc).catch(() => {});
  },

  updateDocumentStatus: (id, status) => {
    const docObj = get().documents.find((d) => d.id === id);
    if (docObj) {
      const updated = { ...docObj, status };
      set((s) => ({
        documents: s.documents.map((d) => (d.id === id ? updated : d)),
      }));
      saveDocument(updated).catch(() => {});
    }
  },

  deleteDocument: (id) => {
    set((s) => ({
      documents: s.documents.filter((d) => d.id !== id),
    }));
    deleteFirestoreDocument(id).catch(() => {});
  },

  // Enquiry Actions
  addEnquiry: (data) => {
    const newId = `enq-${Math.floor(100 + Math.random() * 900)}`;
    const newEnq: Enquiry = {
      ...data,
      id: newId,
      createdDate: new Date().toISOString().split("T")[0],
      activities: [
        {
          id: `act-${Date.now()}`,
          text: "Enquiry created",
          timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
          author: "Admin",
        },
      ],
      notes: [],
      files: [],
    };
    set((s) => ({ enquiries: [newEnq, ...s.enquiries] }));
    saveEnquiry(newEnq).catch(() => {});
  },

  updateEnquiryStatus: (id, status) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) => {
        if (e.id === id) {
          const activities = [
            ...e.activities,
            {
              id: `act-${Date.now()}`,
              text: `Status updated to ${status}`,
              timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              author: "Admin",
            },
          ];
          const updated = { ...e, status, activities };
          saveEnquiry(updated).catch(() => {});
          return updated;
        }
        return e;
      }),
    }));
  },

  assignEnquiry: (id, memberId, memberName) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) => {
        if (e.id === id) {
          const activities = [
            ...e.activities,
            {
              id: `act-${Date.now()}`,
              text: `Assigned to ${memberName}`,
              timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              author: "Admin",
            },
          ];
          const updated = { ...e, assignedTo: memberId, assignedToName: memberName, activities };
          saveEnquiry(updated).catch(() => {});
          return updated;
        }
        return e;
      }),
    }));
  },

  addEnquiryNote: (id, text, author) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) => {
        if (e.id === id) {
          const newNote = {
            id: `not-${Date.now()}`,
            text,
            timestamp: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            author,
          };
          const updated = { ...e, notes: [newNote, ...e.notes] };
          saveEnquiry(updated).catch(() => {});
          return updated;
        }
        return e;
      }),
    }));
  },

  // Project Actions
  addProject: (projectData) => {
    const newId = `prj-${Math.floor(100 + Math.random() * 900)}`;
    const newPrj: Project = {
      ...projectData,
      id: newId,
    };
    set((s) => ({ projects: [newPrj, ...s.projects] }));
    saveProject(newPrj).catch(() => {});
  },

  updateProjectStatus: (id, status) => {
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id === id) {
          const updated = { ...p, status };
          saveProject(updated).catch(() => {});
          return updated;
        }
        return p;
      }),
    }));
  },

  // Task Actions
  addTask: (taskData) => {
    const num = Math.floor(1040 + Math.random() * 60);
    const newTask: Task = {
      ...taskData,
      id: `tsk-${num}`,
      taskKey: `TS-${num}`,
      actualHours: 0,
      checklist: [],
      comments: [],
      attachments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          text: `Task created and assigned to ${taskData.assignedToName}`,
          timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        },
      ],
    };
    set((s) => ({
      tasks: [newTask, ...s.tasks],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Task Assigned",
          message: `${newTask.title} (${newTask.taskKey}) was assigned to ${newTask.assignedToName}.`,
          timestamp: "Just now",
          isRead: false,
          type: "task",
        },
        ...s.notifications,
      ],
    }));
    saveTask(newTask).catch(() => {});
  },

  updateTaskStatus: (id, status) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === id) {
          const updated = {
            ...t,
            status,
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                text: `Status changed to ${status}`,
                timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              },
            ],
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  toggleTaskBlock: (id, reason) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === id) {
          const nextBlocked = !t.isBlocked;
          const updated = {
            ...t,
            isBlocked: nextBlocked,
            blockReason: nextBlocked ? reason || "Blocker reported" : undefined,
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                text: nextBlocked ? `Task Blocked: ${reason || "Blocker reported"}` : "Task unblocked",
                timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              },
            ],
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  toggleChecklistItem: (taskId, itemId) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            checklist: t.checklist.map((item) =>
              item.id === itemId ? { ...item, done: !item.done } : item
            ),
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  addChecklistItem: (taskId, text) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            checklist: [...t.checklist, { id: `chk-${Date.now()}`, text, done: false }],
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  assignTask: (taskId, userId, userName, userAvatar) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            assignedTo: userId,
            assignedToName: userName,
            assignedToAvatar: userAvatar,
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                text: `Reassigned to ${userName}`,
                timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              },
            ],
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  addComment: (taskId, commentText) => {
    const user = get().users.find((u) => u.id === get().currentUserId) || get().users[0];
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === taskId) {
          const updated = {
            ...t,
            comments: [
              ...t.comments,
              {
                id: `com-${Date.now()}`,
                author: user.fullName,
                authorAvatar: user.avatarUrl,
                text: commentText,
                timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              },
            ],
          };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  // Users & Team
  addUser: (userData) => {
    const num = Math.floor(10 + Math.random() * 90);
    const newUser: User = {
      ...userData,
      id: `usr-0${num}`,
      lastActive: "Just now",
    };
    set((s) => ({ users: [...s.users, newUser] }));
    saveUser(newUser).catch(() => {});
  },

  updateUserPermissions: (userId, permissions) => {
    set((s) => ({
      users: s.users.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, permissions };
          saveUser(updated).catch(() => {});
          return updated;
        }
        return u;
      }),
    }));
  },

  toggleUserStatus: (userId) => {
    set((s) => ({
      users: s.users.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            status: u.status === "Active" ? ("Inactive" as const) : ("Active" as const),
          };
          saveUser(updated).catch(() => {});
          return updated;
        }
        return u;
      }),
    }));
  },

  deleteUser: (userId) => {
    set((s) => ({
      users: s.users.filter((u) => u.id !== userId),
    }));
  },

  addTeam: (teamData) => {
    const newTeam: TeamGroup = {
      ...teamData,
      id: `team-${Date.now()}`,
    };
    set((s) => ({ teams: [...s.teams, newTeam] }));
  },

  // Daily Work
  submitDailyReport: (reportData) => {
    const user = get().users.find((u) => u.id === reportData.memberId) || get().users[0];
    const newReport: DailyWorkReport = {
      ...reportData,
      id: `dwr-${Date.now()}`,
      status: "Submitted",
      submittedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    set((s) => ({
      dailyReports: [newReport, ...s.dailyReports.filter((r) => r.id !== newReport.id)],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Daily Work Submitted",
          message: `${user.fullName} submitted report for ${newReport.date}.`,
          timestamp: "Just now",
          isRead: false,
          type: "team",
        },
        ...s.notifications,
      ],
    }));
    saveDailyReport(newReport).catch(() => {});
  },

  // Attendance
  checkIn: (memberId) => {
    const user = get().users.find((u) => u.id === memberId) || get().users[0];
    const today = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const existing = get().attendance.find((a) => a.memberId === memberId && a.date === today);
    if (existing) {
      const updated = { ...existing, breakStatus: "Working" as const };
      set((s) => ({
        attendance: s.attendance.map((a) => (a.id === existing.id ? updated : a)),
      }));
      saveAttendance(updated).catch(() => {});
    } else {
      const newAtt: AttendanceRecord = {
        id: `att-${Date.now()}`,
        memberId,
        memberName: user.fullName,
        date: today,
        status: "Present",
        checkInTime: timeStr,
        breakStatus: "Working",
        workingHours: "0h 01m",
      };
      set((s) => ({ attendance: [newAtt, ...s.attendance] }));
      saveAttendance(newAtt).catch(() => {});
    }
  },

  startBreak: (memberId) => {
    const today = new Date().toISOString().split("T")[0];
    set((s) => ({
      attendance: s.attendance.map((a) => {
        if (a.memberId === memberId && a.date === today) {
          const updated = { ...a, breakStatus: "On Break" as const };
          saveAttendance(updated).catch(() => {});
          return updated;
        }
        return a;
      }),
    }));
  },

  endBreak: (memberId) => {
    const today = new Date().toISOString().split("T")[0];
    set((s) => ({
      attendance: s.attendance.map((a) => {
        if (a.memberId === memberId && a.date === today) {
          const updated = { ...a, breakStatus: "Working" as const };
          saveAttendance(updated).catch(() => {});
          return updated;
        }
        return a;
      }),
    }));
  },

  checkOut: (memberId) => {
    const today = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    set((s) => ({
      attendance: s.attendance.map((a) => {
        if (a.memberId === memberId && a.date === today) {
          const updated = {
            ...a,
            breakStatus: "Checked Out" as const,
            checkOutTime: timeStr,
            workingHours: "8h 00m",
          };
          saveAttendance(updated).catch(() => {});
          return updated;
        }
        return a;
      }),
    }));
  },

  // Invoices
  addInvoice: (data) => {
    const num = Math.floor(100 + Math.random() * 900);
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: data.invoiceNumber || `INV-2026-${num}`,
      paidAmount: data.paidAmount !== undefined ? data.paidAmount : 0,
      balance: data.balance !== undefined ? data.balance : data.amount,
      issueDate: data.issueDate || new Date().toISOString().split("T")[0],
    };
    set((s) => ({ invoices: [newInv, ...s.invoices] }));
    saveInvoice(newInv).catch(() => {});
  },

  // Notifications
  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },
}));
