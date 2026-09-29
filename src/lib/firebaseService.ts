import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Enquiry,
  Project,
  Task,
  User,
  DailyWorkReport,
  AttendanceRecord,
  Invoice,
  PaymentRecord,
  ProjectDocument,
  NotificationItem,
  ClientRecord,
  ExpenseRecord,
  NoteItem,
  NoticeItem,
  FollowUpItem,
  TeamGroup,
} from "@/types";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  ENQUIRIES: "enquiries",
  PROJECTS: "projects",
  TASKS: "tasks",
  DAILY_REPORTS: "daily_reports",
  ATTENDANCE: "attendance",
  INVOICES: "invoices",
  PAYMENTS: "payments",
  DOCUMENTS: "documents",
  NOTIFICATIONS: "notifications",
  CLIENTS: "clients",
  EXPENSES: "expenses",
  NOTES: "notes",
  NOTICES: "notices",
  FOLLOW_UPS: "follow_ups",
  TEAMS: "teams",
} as const;

// ============================================================================
// 1. ENQUIRIES SERVICE
// ============================================================================
export const subscribeEnquiries = (onData: (data: Enquiry[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.ENQUIRIES));
  return onSnapshot(
    q,
    (snap) => {
      const list: Enquiry[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Enquiry));
      onData(list);
    },
    (err) => {
      console.warn("Firestore enquiries subscription notice (fallback to local):", err.message);
    }
  );
};

export const saveEnquiry = async (enquiry: Enquiry): Promise<void> => {
  const ref = doc(db, COLLECTIONS.ENQUIRIES, enquiry.id);
  await setDoc(ref, enquiry, { merge: true });
};

export const deleteEnquiry = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.ENQUIRIES, id));
};

// ============================================================================
// 2. PROJECTS SERVICE
// ============================================================================
export const subscribeProjects = (onData: (data: Project[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.PROJECTS));
  return onSnapshot(
    q,
    (snap) => {
      const list: Project[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Project));
      onData(list);
    },
    (err) => {
      console.warn("Firestore projects subscription notice:", err.message);
    }
  );
};

export const saveProject = async (project: Project): Promise<void> => {
  const ref = doc(db, COLLECTIONS.PROJECTS, project.id);
  await setDoc(ref, project, { merge: true });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
};

// ============================================================================
// 3. TASKS SERVICE
// ============================================================================
export const subscribeTasks = (onData: (data: Task[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.TASKS));
  return onSnapshot(
    q,
    (snap) => {
      const list: Task[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Task));
      onData(list);
    },
    (err) => {
      console.warn("Firestore tasks subscription notice:", err.message);
    }
  );
};

export const saveTask = async (task: Task): Promise<void> => {
  const ref = doc(db, COLLECTIONS.TASKS, task.id);
  await setDoc(ref, task, { merge: true });
};

export const deleteTask = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.TASKS, id));
};

// ============================================================================
// 4. USERS & TEAM SERVICE
// ============================================================================
export const subscribeUsers = (onData: (data: User[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.USERS));
  return onSnapshot(
    q,
    (snap) => {
      const list: User[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as User));
      onData(list);
    },
    (err) => {
      console.warn("Firestore users subscription notice:", err.message);
    }
  );
};

export const saveUser = async (user: User): Promise<void> => {
  const ref = doc(db, COLLECTIONS.USERS, user.id);
  await setDoc(ref, user, { merge: true });
};

// ============================================================================
// 5. DAILY WORK REPORTS & ATTENDANCE
// ============================================================================
export const subscribeDailyReports = (onData: (data: DailyWorkReport[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.DAILY_REPORTS));
  return onSnapshot(
    q,
    (snap) => {
      const list: DailyWorkReport[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as DailyWorkReport));
      onData(list);
    },
    (err) => {
      console.warn("Firestore daily reports subscription notice:", err.message);
    }
  );
};

export const saveDailyReport = async (report: DailyWorkReport): Promise<void> => {
  const ref = doc(db, COLLECTIONS.DAILY_REPORTS, report.id);
  await setDoc(ref, report, { merge: true });
};

export const deleteDailyReport = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.DAILY_REPORTS, id));
};

export const subscribeAttendance = (onData: (data: AttendanceRecord[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.ATTENDANCE));
  return onSnapshot(
    q,
    (snap) => {
      const list: AttendanceRecord[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as AttendanceRecord));
      onData(list);
    },
    (err) => {
      console.warn("Firestore attendance subscription notice:", err.message);
    }
  );
};

export const saveAttendance = async (rec: AttendanceRecord): Promise<void> => {
  const ref = doc(db, COLLECTIONS.ATTENDANCE, rec.id);
  await setDoc(ref, rec, { merge: true });
};

export const deleteAttendance = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, id));
};

// ============================================================================
// 6. INVOICES & PAYMENTS SERVICE
// ============================================================================
export const subscribeInvoices = (onData: (data: Invoice[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.INVOICES));
  return onSnapshot(
    q,
    (snap) => {
      const list: Invoice[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Invoice));
      onData(list);
    },
    (err) => {
      console.warn("Firestore invoices subscription notice:", err.message);
    }
  );
};

export const saveInvoice = async (inv: Invoice): Promise<void> => {
  const ref = doc(db, COLLECTIONS.INVOICES, inv.id);
  await setDoc(ref, inv, { merge: true });
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.INVOICES, id));
};

// ============================================================================
// 7. PROJECT DOCUMENTS (QUOTATIONS & SERVICE AGREEMENTS)
// ============================================================================
export const subscribeDocuments = (onData: (data: ProjectDocument[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.DOCUMENTS));
  return onSnapshot(
    q,
    (snap) => {
      const list: ProjectDocument[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ProjectDocument));
      onData(list);
    },
    (err) => {
      console.warn("Firestore documents subscription notice:", err.message);
    }
  );
};

export const saveDocument = async (docObj: ProjectDocument): Promise<void> => {
  const ref = doc(db, COLLECTIONS.DOCUMENTS, docObj.id);
  await setDoc(ref, docObj, { merge: true });
};

export const deleteDocument = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.DOCUMENTS, id));
};

// ============================================================================
// 8. CLIENTS SERVICE
// ============================================================================
export const subscribeClients = (onData: (data: ClientRecord[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.CLIENTS));
  return onSnapshot(
    q,
    (snap) => {
      const list: ClientRecord[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ClientRecord));
      onData(list);
    },
    (err) => {
      console.warn("Firestore clients subscription notice:", err.message);
    }
  );
};

export const saveClient = async (client: ClientRecord): Promise<void> => {
  const ref = doc(db, COLLECTIONS.CLIENTS, client.id);
  await setDoc(ref, client, { merge: true });
};

export const deleteClient = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.CLIENTS, id));
};

// ============================================================================
// 9. EXPENSES SERVICE
// ============================================================================
export const subscribeExpenses = (onData: (data: ExpenseRecord[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.EXPENSES));
  return onSnapshot(
    q,
    (snap) => {
      const list: ExpenseRecord[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ExpenseRecord));
      onData(list);
    },
    (err) => {
      console.warn("Firestore expenses subscription notice:", err.message);
    }
  );
};

export const saveExpense = async (expense: ExpenseRecord): Promise<void> => {
  const ref = doc(db, COLLECTIONS.EXPENSES, expense.id);
  await setDoc(ref, expense, { merge: true });
};

export const deleteExpense = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.EXPENSES, id));
};

// ============================================================================
// 10. WORKSPACE NOTES SERVICE
// ============================================================================
export const subscribeNotes = (onData: (data: NoteItem[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.NOTES));
  return onSnapshot(
    q,
    (snap) => {
      const list: NoteItem[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as NoteItem));
      onData(list);
    },
    (err) => {
      console.warn("Firestore notes subscription notice:", err.message);
    }
  );
};

export const saveNote = async (note: NoteItem): Promise<void> => {
  const ref = doc(db, COLLECTIONS.NOTES, note.id);
  await setDoc(ref, note, { merge: true });
};

export const deleteNote = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.NOTES, id));
};

// ============================================================================
// 11. WORKSPACE NOTICES SERVICE
// ============================================================================
export const subscribeNotices = (onData: (data: NoticeItem[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.NOTICES));
  return onSnapshot(
    q,
    (snap) => {
      const list: NoticeItem[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as NoticeItem));
      onData(list);
    },
    (err) => {
      console.warn("Firestore notices subscription notice:", err.message);
    }
  );
};

export const saveNotice = async (notice: NoticeItem): Promise<void> => {
  const ref = doc(db, COLLECTIONS.NOTICES, notice.id);
  await setDoc(ref, notice, { merge: true });
};

export const deleteNotice = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.NOTICES, id));
};

// ============================================================================
// 12. FOLLOW-UPS SERVICE
// ============================================================================
export const subscribeFollowUps = (onData: (data: FollowUpItem[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.FOLLOW_UPS));
  return onSnapshot(
    q,
    (snap) => {
      const list: FollowUpItem[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as FollowUpItem));
      onData(list);
    },
    (err) => {
      console.warn("Firestore followups subscription notice:", err.message);
    }
  );
};

export const saveFollowUp = async (followUp: FollowUpItem): Promise<void> => {
  const ref = doc(db, COLLECTIONS.FOLLOW_UPS, followUp.id);
  await setDoc(ref, followUp, { merge: true });
};

export const deleteFollowUp = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.FOLLOW_UPS, id));
};

// ============================================================================
// 13. TEAMS STRUCTURE SERVICE
// ============================================================================
export const subscribeTeams = (onData: (data: TeamGroup[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.TEAMS));
  return onSnapshot(
    q,
    (snap) => {
      const list: TeamGroup[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as TeamGroup));
      onData(list);
    },
    (err) => {
      console.warn("Firestore teams subscription notice:", err.message);
    }
  );
};

export const saveTeam = async (team: TeamGroup): Promise<void> => {
  const ref = doc(db, COLLECTIONS.TEAMS, team.id);
  await setDoc(ref, team, { merge: true });
};

export const deleteTeam = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.TEAMS, id));
};

