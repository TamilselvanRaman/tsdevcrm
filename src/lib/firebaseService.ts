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

const handleSubError = (name: string, err: any) => {
  if (err?.code === "permission-denied" || err?.message?.includes("insufficient permissions")) {
    // Silent debug log for missing or unauthenticated rules; fallback data will remain in store
    console.debug(`Firestore ${name} subscription offline (permissions/auth notice)`);
  } else {
    console.warn(`Firestore ${name} subscription notice:`, err?.message || err);
  }
};

function cleanObject<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  if (!obj || typeof obj !== "object") return obj;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = cleanObject(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          item !== null && typeof item === "object" ? cleanObject(item) : item
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

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
    (err) => handleSubError("enquiries", err)
  );
};

export const saveEnquiry = async (enquiry: Enquiry): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.ENQUIRIES, enquiry.id);
    await setDoc(ref, cleanObject(enquiry), { merge: true });
  } catch (err) {
    console.error("Firestore saveEnquiry error:", err);
  }
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
    (err) => handleSubError("projects", err)
  );
};

export const saveProject = async (project: Project): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.PROJECTS, project.id);
    await setDoc(ref, cleanObject(project), { merge: true });
  } catch (err) {
    console.error("Firestore saveProject error:", err);
  }
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
    (err) => handleSubError("tasks", err)
  );
};

export const saveTask = async (task: Task): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.TASKS, task.id);
    await setDoc(ref, cleanObject(task), { merge: true });
  } catch (err) {
    console.error("Firestore saveTask error:", err);
  }
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
    (err) => handleSubError("users", err)
  );
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(ref, cleanObject(user), { merge: true });
  } catch (err) {
    console.error("Firestore saveUser error:", err);
  }
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
    (err) => handleSubError("daily_reports", err)
  );
};

export const saveDailyReport = async (report: DailyWorkReport): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.DAILY_REPORTS, report.id);
    await setDoc(ref, cleanObject(report), { merge: true });
  } catch (err) {
    console.error("Firestore saveDailyReport error:", err);
  }
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
    (err) => handleSubError("attendance", err)
  );
};

export const saveAttendance = async (rec: AttendanceRecord): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.ATTENDANCE, rec.id);
    await setDoc(ref, cleanObject(rec), { merge: true });
  } catch (err) {
    console.error("Firestore saveAttendance error:", err);
  }
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
    (err) => handleSubError("invoices", err)
  );
};

export const saveInvoice = async (inv: Invoice): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, inv.id);
    await setDoc(ref, cleanObject(inv), { merge: true });
  } catch (err) {
    console.error("Firestore saveInvoice error:", err);
  }
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
    (err) => handleSubError("documents", err)
  );
};

export const saveDocument = async (docObj: ProjectDocument): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.DOCUMENTS, docObj.id);
    await setDoc(ref, cleanObject(docObj), { merge: true });
  } catch (err) {
    console.error("Firestore saveDocument error:", err);
  }
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
    (err) => handleSubError("clients", err)
  );
};

export const saveClient = async (client: ClientRecord): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.CLIENTS, client.id);
    await setDoc(ref, cleanObject(client), { merge: true });
  } catch (err) {
    console.error("Firestore saveClient error:", err);
  }
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
    (err) => handleSubError("expenses", err)
  );
};

export const saveExpense = async (expense: ExpenseRecord): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.EXPENSES, expense.id);
    await setDoc(ref, cleanObject(expense), { merge: true });
  } catch (err) {
    console.error("Firestore saveExpense error:", err);
  }
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
    (err) => handleSubError("notes", err)
  );
};

export const saveNote = async (note: NoteItem): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.NOTES, note.id);
    await setDoc(ref, cleanObject(note), { merge: true });
  } catch (err) {
    console.error("Firestore saveNote error:", err);
  }
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
    (err) => handleSubError("notices", err)
  );
};

export const saveNotice = async (notice: NoticeItem): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.NOTICES, notice.id);
    await setDoc(ref, cleanObject(notice), { merge: true });
  } catch (err) {
    console.error("Firestore saveNotice error:", err);
  }
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
    (err) => handleSubError("follow_ups", err)
  );
};

export const saveFollowUp = async (followUp: FollowUpItem): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.FOLLOW_UPS, followUp.id);
    await setDoc(ref, cleanObject(followUp), { merge: true });
  } catch (err) {
    console.error("Firestore saveFollowUp error:", err);
  }
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
    (err) => handleSubError("teams", err)
  );
};

export const saveTeam = async (team: TeamGroup): Promise<void> => {
  const ref = doc(db, COLLECTIONS.TEAMS, team.id);
  await setDoc(ref, team, { merge: true });
};

export const deleteTeam = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.TEAMS, id));
};

