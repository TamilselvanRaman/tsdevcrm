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
  ClientRecord,
  ExpenseRecord,
  NoteItem,
  NoticeItem,
  FollowUpItem,
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
  deleteDailyReport,
  subscribeAttendance,
  saveAttendance,
  deleteAttendance,
  subscribeInvoices,
  saveInvoice,
  deleteInvoice,
  subscribeDocuments,
  saveDocument,
  deleteDocument as deleteFirestoreDocument,
  subscribeClients,
  saveClient,
  deleteClient,
  subscribeExpenses,
  saveExpense,
  deleteExpense,
  subscribeNotes,
  saveNote,
  deleteNote,
  subscribeNotices,
  saveNotice,
  deleteNotice,
  subscribeFollowUps,
  saveFollowUp,
  deleteFollowUp,
  subscribeTeams,
  saveTeam,
  deleteTeam,
} from "@/lib/firebaseService";

export type PortalMode = "admin" | "team_member";

export const SYSTEM_FALLBACK_USER: User = {
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
  permissions: {
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
  },
};

interface AppState {
  // Auth & Portal State
  isAuthenticated: boolean;
  portalMode: PortalMode;
  currentUserId: string;

  setPortalMode: (mode: PortalMode) => void;
  setCurrentUserId: (id: string) => void;
  loginAsAdmin: (userId?: string) => void;
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
  clients: ClientRecord[];
  expenses: ExpenseRecord[];
  notes: NoteItem[];
  notices: NoticeItem[];
  followUps: FollowUpItem[];

  // Actions - Documents
  addDocument: (doc: Omit<ProjectDocument, "id">) => void;
  updateDocument: (id: string, updates: Partial<ProjectDocument>) => void;
  updateDocumentStatus: (id: string, status: ProjectDocumentStatus) => void;
  deleteDocument: (id: string) => void;

  // Actions - Enquiries
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "createdDate" | "activities" | "notes" | "files">) => void;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => void;
  updateEnquiryStatus: (id: string, status: Enquiry["status"]) => void;
  assignEnquiry: (id: string, memberId: string, memberName: string) => void;
  addEnquiryNote: (id: string, text: string, author: string) => void;
  deleteEnquiry: (id: string) => void;

  // Actions - Projects
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProjectStatus: (id: string, status: Project["status"]) => void;
  deleteProject: (id: string) => void;

  // Actions - Tasks
  addTask: (task: Omit<Task, "id" | "taskKey" | "checklist" | "comments" | "attachments" | "activities" | "actualHours">) => void;
  createTask: (task: Omit<Task, "id" | "taskKey" | "checklist" | "comments" | "attachments" | "activities" | "actualHours">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskBlock: (id: string, reason?: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  assignTask: (taskId: string, userId: string, userName: string, userAvatar: string) => void;
  addComment: (taskId: string, commentText: string) => void;
  deleteTask: (id: string) => void;

  // Actions - Team & Users
  addUser: (user: Omit<User, "id" | "lastActive">) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Actions - Teams Structure
  addTeam: (team: Omit<TeamGroup, "id">) => void;
  updateTeam: (id: string, updates: Partial<TeamGroup>) => void;
  deleteTeam: (id: string) => void;

  // Actions - Daily Work
  submitDailyReport: (report: Omit<DailyWorkReport, "id" | "submittedAt" | "submitted">) => void;
  updateDailyReport: (id: string, updates: Partial<DailyWorkReport>) => void;
  updateDailyReportStatus: (id: string, status: DailyWorkReport["status"]) => void;
  deleteDailyReport: (id: string) => void;

  // Actions - Attendance
  checkIn: (memberId: string) => void;
  startBreak: (memberId: string) => void;
  endBreak: (memberId: string) => void;
  checkOut: (memberId: string) => void;
  recordAttendance: (record: AttendanceRecord) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  deleteAttendance: (id: string) => void;

  // Actions - Invoices
  addInvoice: (invoice: Omit<Invoice, "id">) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Actions - Clients
  addClient: (client: Omit<ClientRecord, "id">) => void;
  updateClient: (id: string, updates: Partial<ClientRecord>) => void;
  deleteClient: (id: string) => void;

  // Actions - Expenses
  addExpense: (expense: Omit<ExpenseRecord, "id">) => void;
  updateExpense: (id: string, updates: Partial<ExpenseRecord>) => void;
  deleteExpense: (id: string) => void;

  // Actions - Notes
  addNote: (note: Omit<NoteItem, "id">) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Actions - Notices
  addNotice: (notice: Omit<NoticeItem, "id">) => void;
  updateNotice: (id: string, updates: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;
  acknowledgeNotice: (id: string) => void;

  // Actions - Follow-ups
  addFollowUp: (followUp: Omit<FollowUpItem, "id">) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUpItem>) => void;
  deleteFollowUp: (id: string) => void;

  // Actions - Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: true,
  portalMode: "admin",
  currentUserId: "usr-001", // Tamil Selvan default

  setPortalMode: (mode) => set({ portalMode: mode }),
  setCurrentUserId: (id) => set({ currentUserId: id }),

  loginAsAdmin: (userId?: string) =>
    set((state) => ({
      isAuthenticated: true,
      portalMode: "admin",
      currentUserId: userId || state.currentUserId || "usr-001",
    })),

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
      if (list !== undefined && list !== null) set({ users: list });
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
    const unsubClients = subscribeClients((list) => {
      if (list !== undefined && list !== null) set({ clients: list });
    });
    const unsubExpenses = subscribeExpenses((list) => {
      if (list !== undefined && list !== null) set({ expenses: list });
    });
    const unsubNotes = subscribeNotes((list) => {
      if (list !== undefined && list !== null) set({ notes: list });
    });
    const unsubNotices = subscribeNotices((list) => {
      if (list !== undefined && list !== null) set({ notices: list });
    });
    const unsubFollowUps = subscribeFollowUps((list) => {
      if (list !== undefined && list !== null) set({ followUps: list });
    });
    const unsubTeams = subscribeTeams((list) => {
      if (list !== undefined && list !== null) set({ teams: list });
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
      unsubClients();
      unsubExpenses();
      unsubNotes();
      unsubNotices();
      unsubFollowUps();
      unsubTeams();
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
  clients: [],
  expenses: [],
  notes: [],
  notices: [],
  followUps: [],

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

  updateDocument: (id, updates) => {
    const docObj = get().documents.find((d) => d.id === id);
    if (docObj) {
      const updated = { ...docObj, ...updates };
      set((s) => ({
        documents: s.documents.map((d) => (d.id === id ? updated : d)),
      }));
      saveDocument(updated).catch(() => {});
    }
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

  updateEnquiry: (id, updates) => {
    set((s) => ({
      enquiries: s.enquiries.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          saveEnquiry(updated).catch(() => {});
          return updated;
        }
        return e;
      }),
    }));
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

  deleteEnquiry: (id) => {
    set((s) => ({
      enquiries: s.enquiries.filter((e) => e.id !== id),
    }));
    deleteEnquiry(id).catch(() => {});
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

  updateProject: (id, updates) => {
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          saveProject(updated).catch(() => {});
          return updated;
        }
        return p;
      }),
    }));
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

  deleteProject: (id) => {
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
    }));
    deleteProject(id).catch(() => {});
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

  createTask: (task) => {
    get().addTask(task);
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

  updateTask: (id, updates) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          saveTask(updated).catch(() => {});
          return updated;
        }
        return t;
      }),
    }));
  },

  deleteTask: (id) => {
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
    }));
    deleteTask(id).catch(() => {});
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

  updateUser: (userId, updates) => {
    set((s) => ({
      users: s.users.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          saveUser(updated).catch(() => {});
          return updated;
        }
        return u;
      }),
    }));
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
    saveTeam(newTeam).catch(() => {});
  },

  updateTeam: (id, updates) => {
    set((s) => ({
      teams: s.teams.map((tm) => {
        if (tm.id === id) {
          const updated = { ...tm, ...updates };
          saveTeam(updated).catch(() => {});
          return updated;
        }
        return tm;
      }),
    }));
  },

  deleteTeam: (id) => {
    set((s) => ({
      teams: s.teams.filter((tm) => tm.id !== id),
    }));
    deleteTeam(id).catch(() => {});
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

  updateDailyReport: (id, updates) => {
    set((s) => ({
      dailyReports: s.dailyReports.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          saveDailyReport(updated).catch(() => {});
          return updated;
        }
        return r;
      }),
    }));
  },

  updateDailyReportStatus: (id, status) => {
    set((s) => ({
      dailyReports: s.dailyReports.map((r) => {
        if (r.id === id) {
          const updated = { ...r, status };
          saveDailyReport(updated).catch(() => {});
          return updated;
        }
        return r;
      }),
    }));
  },

  deleteDailyReport: (id) => {
    set((s) => ({
      dailyReports: s.dailyReports.filter((r) => r.id !== id),
    }));
    deleteDailyReport(id).catch(() => {});
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

  recordAttendance: (record) => {
    set((s) => ({ attendance: [record, ...s.attendance.filter((a) => a.id !== record.id)] }));
    saveAttendance(record).catch(() => {});
  },

  updateAttendance: (id, updates) => {
    set((s) => ({
      attendance: s.attendance.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          saveAttendance(updated).catch(() => {});
          return updated;
        }
        return a;
      }),
    }));
  },

  deleteAttendance: (id) => {
    set((s) => ({
      attendance: s.attendance.filter((a) => a.id !== id),
    }));
    deleteAttendance(id).catch(() => {});
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

  updateInvoice: (id, updates) => {
    set((s) => ({
      invoices: s.invoices.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, ...updates };
          saveInvoice(updated).catch(() => {});
          return updated;
        }
        return inv;
      }),
    }));
  },

  deleteInvoice: (id) => {
    set((s) => ({
      invoices: s.invoices.filter((inv) => inv.id !== id),
    }));
    deleteInvoice(id).catch(() => {});
  },

  // Clients Actions
  addClient: (clientData) => {
    const newClient: ClientRecord = {
      ...clientData,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((s) => ({ clients: [newClient, ...s.clients] }));
    saveClient(newClient).catch(() => {});
  },

  updateClient: (id, updates) => {
    set((s) => ({
      clients: s.clients.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          saveClient(updated).catch(() => {});
          return updated;
        }
        return c;
      }),
    }));
  },

  deleteClient: (id) => {
    set((s) => ({
      clients: s.clients.filter((c) => c.id !== id),
    }));
    deleteClient(id).catch(() => {});
  },

  // Expenses Actions
  addExpense: (expenseData) => {
    const newExp: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    set((s) => ({ expenses: [newExp, ...s.expenses] }));
    saveExpense(newExp).catch(() => {});
  },

  updateExpense: (id, updates) => {
    set((s) => ({
      expenses: s.expenses.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          saveExpense(updated).catch(() => {});
          return updated;
        }
        return e;
      }),
    }));
  },

  deleteExpense: (id) => {
    set((s) => ({
      expenses: s.expenses.filter((e) => e.id !== id),
    }));
    deleteExpense(id).catch(() => {});
  },

  // Notes Actions
  addNote: (noteData) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    set((s) => ({ notes: [newNote, ...s.notes] }));
    saveNote(newNote).catch(() => {});
  },

  updateNote: (id, updates) => {
    set((s) => ({
      notes: s.notes.map((n) => {
        if (n.id === id) {
          const updated = { ...n, ...updates };
          saveNote(updated).catch(() => {});
          return updated;
        }
        return n;
      }),
    }));
  },

  deleteNote: (id) => {
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
    }));
    deleteNote(id).catch(() => {});
  },

  togglePinNote: (id) => {
    set((s) => ({
      notes: s.notes.map((n) => {
        if (n.id === id) {
          const updated = { ...n, isPinned: !n.isPinned };
          saveNote(updated).catch(() => {});
          return updated;
        }
        return n;
      }),
    }));
  },

  // Notices Actions
  addNotice: (noticeData) => {
    const newNotice: NoticeItem = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      publishedDate: new Date().toISOString().split("T")[0],
      acknowledgements: 0,
    };
    set((s) => ({ notices: [newNotice, ...s.notices] }));
    saveNotice(newNotice).catch(() => {});
  },

  updateNotice: (id, updates) => {
    set((s) => ({
      notices: s.notices.map((n) => {
        if (n.id === id) {
          const updated = { ...n, ...updates };
          saveNotice(updated).catch(() => {});
          return updated;
        }
        return n;
      }),
    }));
  },

  deleteNotice: (id) => {
    set((s) => ({
      notices: s.notices.filter((n) => n.id !== id),
    }));
    deleteNotice(id).catch(() => {});
  },

  acknowledgeNotice: (id) => {
    set((s) => ({
      notices: s.notices.map((n) => {
        if (n.id === id) {
          const updated = { ...n, acknowledgements: n.acknowledgements + 1 };
          saveNotice(updated).catch(() => {});
          return updated;
        }
        return n;
      }),
    }));
  },

  // Follow-ups Actions
  addFollowUp: (followUpData) => {
    const newFollowUp: FollowUpItem = {
      ...followUpData,
      id: `fol-${Date.now()}`,
    };
    set((s) => ({ followUps: [newFollowUp, ...s.followUps] }));
    saveFollowUp(newFollowUp).catch(() => {});
  },

  updateFollowUp: (id, updates) => {
    set((s) => ({
      followUps: s.followUps.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          saveFollowUp(updated).catch(() => {});
          return updated;
        }
        return f;
      }),
    }));
  },

  deleteFollowUp: (id) => {
    set((s) => ({
      followUps: s.followUps.filter((f) => f.id !== id),
    }));
    deleteFollowUp(id).catch(() => {});
  },

  // Notifications
  markNotificationRead: (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllNotificationsRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  deleteNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));
