/* Signed session cookie (HMAC-SHA256 via Web Crypto, so it works in middleware and on the server).
   Set AUTH_SECRET in Vercel → Settings → Environment Variables (any long random string). */
export const SESSION_COOKIE = "ascent_session";
export const SESSION_DAYS = 30;

export type Role = "student" | "parent" | "admin"; // "admin" is legacy and treated as a student

export function homeFor(role: Role) {
  return role === "parent" ? "/parent/home" : "/today";
}
export type Session = { u: string; role: Role; exp: number };

const DEV_SECRET = "dev-only-secret-set-AUTH_SECRET-in-vercel";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") console.warn("AUTH_SECRET is not set. Using a fallback secret; set it in Vercel.");
  return s || DEV_SECRET;
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array) {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function key() {
  return crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(s: Omit<Session, "exp">, days = SESSION_DAYS): Promise<string> {
  const payload: Session = { ...s, exp: Date.now() + days * 864e5 };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await key(), enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), fromB64url(sig), enc.encode(body));
    if (!ok) return null;
    const s = JSON.parse(new TextDecoder().decode(fromB64url(body))) as Session;
    if (!s.u || typeof s.exp !== "number" || s.exp < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}
