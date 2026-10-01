import { User } from "@/types";
import { ADMIN_PERMISSIONS, DEFAULT_PERMISSIONS } from "./mockData";

export interface AuthorizedAccount {
  id: string;
  email: string;
  fullName: string;
  username: string;
  phone: string;
  role: "Admin" | "Developer" | "Designer";
  team: "Management" | "Development" | "Design";
  avatarUrl: string;
  accountType: "admin" | "member";
}

export const AUTHORIZED_ADMINS: AuthorizedAccount[] = [
  {
    id: "usr-admin-vishal",
    email: "vishalbharath566@tsdev.io",
    fullName: "Vishal Bharath",
    username: "vishalbharath566",
    phone: "+91 98765 43211",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    accountType: "admin",
  },
  {
    id: "usr-admin-jeeva",
    email: "imjeeva08@tsdev.io",
    fullName: "Jeeva",
    username: "imjeeva08",
    phone: "+91 98765 43212",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    accountType: "admin",
  },
  {
    id: "usr-001",
    email: "ceittamilselvanr26@tsdev.io",
    fullName: "Tamil Selvan",
    username: "ceittamilselvanr26",
    phone: "+91 98427 20929",
    role: "Admin",
    team: "Management",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    accountType: "admin",
  },
];

export const AUTHORIZED_MEMBERS: AuthorizedAccount[] = [
  {
    id: "usr-mem-tamil",
    email: "ceittamilselvanr26@gmail.com",
    fullName: "Tamil Selvan",
    username: "ceittamilselvan_mem",
    phone: "+91 98427 20929",
    role: "Developer",
    team: "Development",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    accountType: "member",
  },
  {
    id: "usr-mem-vishal",
    email: "vishalbharath566@gmail.com",
    fullName: "Vishal Bharath",
    username: "vishalbharath_mem",
    phone: "+91 98765 43211",
    role: "Developer",
    team: "Development",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    accountType: "member",
  },
  {
    id: "usr-mem-jeeva",
    email: "imjeeva08@gmail.com",
    fullName: "Jeeva",
    username: "imjeeva_mem",
    phone: "+91 98765 43212",
    role: "Designer",
    team: "Design",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    accountType: "member",
  },
];

export const ALL_AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  ...AUTHORIZED_ADMINS,
  ...AUTHORIZED_MEMBERS,
];

export const INITIAL_USERS_DATASET: User[] = ALL_AUTHORIZED_ACCOUNTS.map((acc) => ({
  id: acc.id,
  fullName: acc.fullName,
  email: acc.email,
  username: acc.username,
  phone: acc.phone,
  role: acc.role,
  team: acc.team,
  avatarUrl: acc.avatarUrl,
  status: "Active",
  lastActive: "Just now",
  permissions: acc.accountType === "admin" ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS,
}));

export function findAuthorizedAccount(identifier: string): AuthorizedAccount | null {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  return (
    ALL_AUTHORIZED_ACCOUNTS.find(
      (acc) =>
        acc.email.toLowerCase() === clean ||
        acc.username.toLowerCase() === clean ||
        acc.email.split("@")[0].toLowerCase() === clean
    ) || null
  );
}

export function isAuthorizedEmail(email: string): boolean {
  return findAuthorizedAccount(email) !== null;
}
