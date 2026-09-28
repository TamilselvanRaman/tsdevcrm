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
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_ENQUIRIES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_DAILY_REPORTS,
  INITIAL_ATTENDANCE,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_PROJECT_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from "./mockData";

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
// 8. AUTO-SEED DATABASE IF INITIAL FIREBASE IS EMPTY
// ============================================================================
export const seedFirestoreIfEmpty = async (): Promise<boolean> => {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    if (!snap.empty) {
      return false; // Already seeded
    }

    const batch = writeBatch(db);

    INITIAL_USERS.forEach((u) => {
      batch.set(doc(db, COLLECTIONS.USERS, u.id), u);
    });
    INITIAL_ENQUIRIES.forEach((e) => {
      batch.set(doc(db, COLLECTIONS.ENQUIRIES, e.id), e);
    });
    INITIAL_PROJECTS.forEach((p) => {
      batch.set(doc(db, COLLECTIONS.PROJECTS, p.id), p);
    });
    INITIAL_TASKS.forEach((t) => {
      batch.set(doc(db, COLLECTIONS.TASKS, t.id), t);
    });
    INITIAL_DAILY_REPORTS.forEach((d) => {
      batch.set(doc(db, COLLECTIONS.DAILY_REPORTS, d.id), d);
    });
    INITIAL_ATTENDANCE.forEach((a) => {
      batch.set(doc(db, COLLECTIONS.ATTENDANCE, a.id), a);
    });
    INITIAL_INVOICES.forEach((i) => {
      batch.set(doc(db, COLLECTIONS.INVOICES, i.id), i);
    });
    INITIAL_PAYMENTS.forEach((p) => {
      batch.set(doc(db, COLLECTIONS.PAYMENTS, p.id), p);
    });
    INITIAL_PROJECT_DOCUMENTS.forEach((docObj) => {
      batch.set(doc(db, COLLECTIONS.DOCUMENTS, docObj.id), docObj);
    });
    INITIAL_NOTIFICATIONS.forEach((n) => {
      batch.set(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), n);
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.warn("Firestore seed notice (offline/permission):", error);
    return false;
  }
};
