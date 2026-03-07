import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "super_admin" | "manager";

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: CRMUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  users: CRMUser[];
  addUser: (user: Omit<CRMUser, "id" | "createdAt"> & { password: string }) => void;
  updateUser: (id: string, updates: Partial<CRMUser>) => void;
  removeUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Initial users with hashed passwords stored as plain text for demo (in production use bcrypt)
const INITIAL_USERS: (CRMUser & { password: string })[] = [
  {
    id: "user-1",
    name: "Sam Elsha",
    email: "sam.elsha@barrinagardens.com.au",
    role: "super_admin",
    createdAt: "2024-01-01",
    password: "Elshafam007",
  },
  {
    id: "user-2",
    name: "Jamain Elsha",
    email: "jamain.elsha@barrinagardens.com.au",
    role: "super_admin",
    createdAt: "2024-01-01",
    password: "BarrinaAdmin2024",
  },
  {
    id: "user-3",
    name: "Laurain Elsha",
    email: "laurain.elsha@barrinagardens.com.au",
    role: "super_admin",
    createdAt: "2024-01-01",
    password: "BarrinaAdmin2024",
  },
  {
    id: "user-4",
    name: "Mike Armour",
    email: "mike.armour@barrinagardens.com.au",
    role: "super_admin",
    createdAt: "2024-01-01",
    password: "BarrinaAdmin2024",
  },
  {
    id: "user-5",
    name: "Nikki Pedersen",
    email: "nikki.pedersen@barrinagardens.com.au",
    role: "super_admin",
    createdAt: "2024-01-01",
    password: "BarrinaAdmin2024",
  },
  {
    id: "user-6",
    name: "Katherine Connick",
    email: "katherine.connick@barrinagardens.com.au",
    role: "manager",
    avatar: "/assets/photos/KatherineConnick.JPEG",
    createdAt: "2024-01-01",
    password: "BarrinaManager2024",
  },
];

const STORAGE_KEY = "bgm_crm_users";
const SESSION_KEY = "bgm_crm_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CRMUser | null>(null);
  const [users, setUsers] = useState<(CRMUser & { password: string })[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USERS;
  });

  // Restore session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const sessionUser = JSON.parse(session) as CRMUser;
        // Verify user still exists
        const currentUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as (CRMUser & { password: string })[];
        const allUsers = currentUsers.length > 0 ? currentUsers : INITIAL_USERS;
        const found = allUsers.find((u) => u.id === sessionUser.id);
        if (found) {
          const { password: _, ...userWithoutPassword } = found;
          setUser(userWithoutPassword);
        }
      }
    } catch {}
  }, []);

  // Persist users to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        return { success: false, error: "Invalid email or password." };
      }
      const { password: _, ...userWithoutPassword } = found;
      const updatedUser = { ...userWithoutPassword, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      return { success: true };
    },
    [users]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const addUser = useCallback(
    (newUser: Omit<CRMUser, "id" | "createdAt"> & { password: string }) => {
      const id = `user-${Date.now()}`;
      const created: CRMUser & { password: string } = {
        ...newUser,
        id,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, created]);
    },
    []
  );

  const updateUser = useCallback((id: string, updates: Partial<CRMUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const isSuperAdmin = user?.role === "super_admin";

  // Expose users without passwords
  const publicUsers: CRMUser[] = users.map(({ password: _, ...u }) => u);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSuperAdmin,
        login,
        logout,
        users: publicUsers,
        addUser,
        updateUser,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
