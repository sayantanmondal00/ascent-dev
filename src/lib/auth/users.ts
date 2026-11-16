import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";
import type { Role } from "./session";

/* TEMPORARY accounts until Supabase is connected. Only a salted scrypt hash is stored, never the password.
   Remove the demo account before real launch. */
type StoredUser = { username: string; role: Role; salt: string; hash: string };

const USERS: StoredUser[] = [
  { username: "admin", role: "admin", salt: "90618876fb22f180072bac4bf4be6168", hash: "6a95e0334cc5e2311e310e2b8e7c4c85b69b109a71474e0b1719d561d75ac0c2f47064a83bb434e406fb3a58be5d93909e8f18ece0b2249f452b077f66f37d7d" },
];

export function verifyPassword(username: string, password: string): StoredUser | null {
  const u = USERS.find((x) => x.username === username.trim().toLowerCase());
  // Hash even when the user is unknown, so timing does not reveal which usernames exist.
  const salt = u?.salt ?? "0000000000000000";
  const got = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  if (!u) return null;
  return timingSafeEqual(got, Buffer.from(u.hash, "hex")) ? u : null;
}

export function isReserved(username: string) {
  return USERS.some((x) => x.username === username.trim().toLowerCase()) || ["ascent", "support", "root"].includes(username.trim().toLowerCase());
}

