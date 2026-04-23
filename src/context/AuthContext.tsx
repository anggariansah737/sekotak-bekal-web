import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { DbCustomer } from "@/types/database";

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  else if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return cleaned;
}

interface AuthContextValue {
  user: DbCustomer | null;
  loading: boolean;
  register: (name: string, phone: string, password: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedUserId = localStorage.getItem("sekotak_user_id");
      if (savedUserId) {
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("id", savedUserId)
          .single();
        setUser(customer || null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const register = async (name: string, phone: string, password: string) => {
    const normalizedPhone = formatPhone(phone);

    // Check if phone already exists
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", normalizedPhone)
      .single();

    if (existing) {
      throw new Error("Nomor HP sudah terdaftar");
    }

    // Hash password (simple hash for MVP - use crypto.subtle in production)
    const passwordHash = await hashPassword(password);

    // Generate UUID client-side to ensure it's set
    const customerId = crypto.randomUUID();

    // Create customer with phone + password hash
    const { data: newCustomer, error } = await supabase
      .from("customers")
      .insert([
        {
          id: customerId,
          name,
          phone: normalizedPhone,
          password_hash: passwordHash,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Save session
    localStorage.setItem("sekotak_user_id", newCustomer.id);
    setUser(newCustomer);
  };

  const login = async (phone: string, password: string) => {
    const normalizedPhone = formatPhone(phone);

    // Get customer by phone
    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", normalizedPhone)
      .single();

    if (error || !customer) {
      throw new Error("Nomor HP tidak ditemukan");
    }

    // Verify password
    const isValid = await verifyPassword(
      password,
      customer.password_hash || "",
    );
    if (!isValid) {
      throw new Error("Password salah");
    }

    // Save session
    localStorage.setItem("sekotak_user_id", customer.id);
    setUser(customer);
  };

  const logout = async () => {
    localStorage.removeItem("sekotak_user_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Simple password hashing for MVP (use bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}
