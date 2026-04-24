import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "superadmin" | "manager" | "sales" | "accounts" | "viewer" | "customer";

export interface VenkatUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  unit: string;
  avatar?: string;
}

interface AuthContextType {
  user: VenkatUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  can: (action: Permission) => boolean;
}

export type Permission =
  | "view:sales"
  | "view:purchases"
  | "view:inventory"
  | "view:outstanding"
  | "view:pnl"
  | "view:gst"
  | "view:units"
  | "view:users"
  | "view:settings"
  | "view:customerportal"
  | "view:leads"
  | "export:reports"
  | "manage:users"
  | "manage:settings"
  | "manage:leads";

const DEMO_USERS: (VenkatUser & { password: string })[] = [
  { id: 1, name: "Venkat Raju",  email: "admin@venkat.com",    password: "Admin@123",    role: "superadmin", unit: "Both"   },
  { id: 2, name: "Rajesh Kumar", email: "manager@venkat.com",  password: "Manager@123",  role: "manager",    unit: "Both"   },
  { id: 3, name: "Priya Sharma", email: "sales@venkat.com",    password: "Sales@123",    role: "sales",      unit: "Unit 1" },
  { id: 4, name: "Kavitha M",    email: "accounts@venkat.com", password: "Accounts@123", role: "accounts",   unit: "Both"   },
  { id: 5, name: "Anand V",      email: "viewer@venkat.com",   password: "Viewer@123",   role: "viewer",     unit: "Unit 2" },
  // Customer portal
  { id: 6, name: "BHEL Bangalore",     email: "bhel@portal.venkat.com",    password: "BHEL@123",    role: "customer", unit: "Unit 1" },
  { id: 7, name: "Brigade Enterprises",email: "brigade@portal.venkat.com", password: "Brigade@123", role: "customer", unit: "Unit 2" },
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  superadmin: [
    "view:sales","view:purchases","view:inventory","view:outstanding",
    "view:pnl","view:gst","view:units","view:users","view:settings","view:customerportal",
    "view:leads","export:reports","manage:users","manage:settings","manage:leads",
  ],
  manager: [
    "view:sales","view:purchases","view:inventory","view:outstanding",
    "view:pnl","view:gst","view:units","view:customerportal",
    "view:leads","manage:leads","export:reports",
  ],
  sales: ["view:sales","view:inventory","view:outstanding","view:leads","manage:leads","export:reports"],
  accounts: ["view:purchases","view:outstanding","view:pnl","view:gst","export:reports"],
  viewer: ["view:sales","view:inventory","view:outstanding","view:pnl","view:leads"],
  customer: ["view:customerportal"],
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<VenkatUser | null>(() => {
    const stored = localStorage.getItem("venkat_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("venkat_theme");
    return stored ? stored === "dark" : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("venkat_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const login = async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password" };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem("venkat_user", JSON.stringify(userData));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("venkat_user");
  };

  const toggleTheme = () => setIsDark(d => !d);

  const can = (action: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(action) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isDark, toggleTheme, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  manager: "Manager",
  sales: "Sales Executive",
  accounts: "Accounts",
  viewer: "Viewer",
  customer: "Customer",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: "badge-red",
  manager: "badge-navy",
  sales: "badge-green",
  accounts: "badge-amber",
  viewer: "badge-blue",
  customer: "badge-green",
};
