/**
 * Backend API Client Service
 * Connects Frontend UI Components directly to Next.js API Routes (`/api/*`)
 * with automatic Zod payload validation and Firestore persistence.
 */

export async function apiFetch<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    const errorMsg = data.error || `HTTP ${res.status}: Request failed`;
    console.error(`API Error [${endpoint}]:`, data);
    throw new Error(errorMsg);
  }

  return data;
}

// 1. Enquiries API
export const enquiriesApi = {
  getAll: () => apiFetch("enquiries"),
  getById: (id: string) => apiFetch(`enquiries/${id}`),
  create: (data: any) => apiFetch("enquiries", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`enquiries/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`enquiries/${id}`, { method: "DELETE" }),
};

// 2. Follow-Ups API
export const followUpsApi = {
  getAll: () => apiFetch("follow-ups"),
  getById: (id: string) => apiFetch(`follow-ups/${id}`),
  create: (data: any) => apiFetch("follow-ups", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`follow-ups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`follow-ups/${id}`, { method: "DELETE" }),
};

// 3. Clients API
export const clientsApi = {
  getAll: () => apiFetch("clients"),
  getById: (id: string) => apiFetch(`clients/${id}`),
  create: (data: any) => apiFetch("clients", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`clients/${id}`, { method: "DELETE" }),
};

// 4. Projects API
export const projectsApi = {
  getAll: () => apiFetch("projects"),
  getById: (id: string) => apiFetch(`projects/${id}`),
  create: (data: any) => apiFetch("projects", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`projects/${id}`, { method: "DELETE" }),
};

// 5. Tasks API
export const tasksApi = {
  getAll: () => apiFetch("tasks"),
  getById: (id: string) => apiFetch(`tasks/${id}`),
  create: (data: any) => apiFetch("tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`tasks/${id}`, { method: "DELETE" }),
};

// 6. Users API
export const usersApi = {
  getAll: () => apiFetch("users"),
  getById: (id: string) => apiFetch(`users/${id}`),
  create: (data: any) => apiFetch("users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`users/${id}`, { method: "DELETE" }),
};

// 7. Daily Reports API
export const dailyReportsApi = {
  getAll: () => apiFetch("daily-reports"),
  getById: (id: string) => apiFetch(`daily-reports/${id}`),
  create: (data: any) => apiFetch("daily-reports", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`daily-reports/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`daily-reports/${id}`, { method: "DELETE" }),
};

// 8. Attendance API
export const attendanceApi = {
  getAll: () => apiFetch("attendance"),
  getById: (id: string) => apiFetch(`attendance/${id}`),
  create: (data: any) => apiFetch("attendance", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`attendance/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`attendance/${id}`, { method: "DELETE" }),
};

// 9. Invoices API
export const invoicesApi = {
  getAll: () => apiFetch("invoices"),
  getById: (id: string) => apiFetch(`invoices/${id}`),
  create: (data: any) => apiFetch("invoices", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`invoices/${id}`, { method: "DELETE" }),
};

// 10. Documents API
export const documentsApi = {
  getAll: () => apiFetch("documents"),
  getById: (id: string) => apiFetch(`documents/${id}`),
  create: (data: any) => apiFetch("documents", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`documents/${id}`, { method: "DELETE" }),
};

// 11. Notes API
export const notesApi = {
  getAll: () => apiFetch("notes"),
  getById: (id: string) => apiFetch(`notes/${id}`),
  create: (data: any) => apiFetch("notes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`notes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`notes/${id}`, { method: "DELETE" }),
};

// 12. Notices API
export const noticesApi = {
  getAll: () => apiFetch("notices"),
  getById: (id: string) => apiFetch(`notices/${id}`),
  create: (data: any) => apiFetch("notices", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`notices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`notices/${id}`, { method: "DELETE" }),
};

// 13. Expenses API
export const expensesApi = {
  getAll: () => apiFetch("expenses"),
  getById: (id: string) => apiFetch(`expenses/${id}`),
  create: (data: any) => apiFetch("expenses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`expenses/${id}`, { method: "DELETE" }),
};

// 14. Teams API
export const teamsApi = {
  getAll: () => apiFetch("teams"),
  getById: (id: string) => apiFetch(`teams/${id}`),
  create: (data: any) => apiFetch("teams", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch(`teams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch(`teams/${id}`, { method: "DELETE" }),
};

// 15. Master Database Seeding API
export const seedApi = {
  triggerSeed: () => apiFetch("seed", { method: "POST" }),
};
