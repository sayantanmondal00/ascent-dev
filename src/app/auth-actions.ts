"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_DAYS, homeFor, signSession, type Role } from "@/lib/auth/session";
import { isReserved, verifyPassword } from "@/lib/auth/users";
import { passwordProblem, usernameProblem } from "@/lib/auth/rules";

async function setSession(u: string, role: Role) {
  const token = await signSession({ u, role });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

function safeNext(next: unknown, fallback: string) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export type LoginState = { error?: string; username?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const username = String(form.get("username") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password.", username };
  const user = verifyPassword(username, password);
  if (!user) return { error: "That username and password don't match. Check them and try again.", username };
  await setSession(user.username, user.role);
  // Go where the account belongs; a "next" link is used only if it is in that account's area.
  const home = homeFor(user.role);
  const next = safeNext(form.get("next"), home);
  const nextIsParent = next.startsWith("/parent");
  redirect(nextIsParent === (user.role === "parent") ? next : home);
}

/* Checks a new username and password at sign-up (step 1). Nothing is stored until a parent agrees. */
export async function checkNewAccount(username: string, password: string): Promise<{ error?: string }> {
  const u = username.trim().toLowerCase();
  const up = usernameProblem(u);
  if (up) return { error: up };
  if (isReserved(u)) return { error: "That username is taken. Try another." };
  const pp = passwordProblem(password);
  if (pp) return { error: pp };
  return {};
}

/* SAMPLE: until Supabase is connected, finishing sign-up signs the person in on this device only. */
export async function finishSignup(username: string, role: "student" | "parent") {
  const u = username.trim().toLowerCase();
  if (usernameProblem(u) || isReserved(u)) redirect(role === "parent" ? "/parent/setup" : "/signup");
  await setSession(u, role);
  redirect(role === "parent" ? "/parent/home" : "/today?mode=day1");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
