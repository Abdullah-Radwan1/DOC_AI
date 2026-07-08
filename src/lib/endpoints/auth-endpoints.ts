import { api } from "@/lib/api";
import { type User } from "../types/user_types";
import { mapUser } from "./user-endpoints";
// Auth

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/me");
    return data?.user ? mapUser(data.user) : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post("/auth/login", { email, password });
  return mapUser(data.user);
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<User> {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
  return mapUser(data.user);
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
