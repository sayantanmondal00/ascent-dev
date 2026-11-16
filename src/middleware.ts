import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, homeFor, verifySession } from "@/lib/auth/session";

/* Pages that need a signed-in user. The demo topic (?demo=1) stays open without an account. */
const PROTECTED = ["/today", "/learn", "/me", "/topic", "/quiz", "/result", "/parent"];
const PUBLIC_PARENT = ["/parent/setup"];

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  if (session && (pathname === "/" || (pathname === "/login" && !searchParams.get("reason")))) {
    return NextResponse.redirect(new URL(homeFor(session.role), req.url));
  }

  // The parent area is for parent accounts only (a student can't open it, even on a shared phone).
  const parentArea = pathname.startsWith("/parent") && !PUBLIC_PARENT.some((p) => pathname.startsWith(p));
  if (session && parentArea && session.role !== "parent") {
    const url = new URL("/login", req.url);
    url.searchParams.set("as", "parent");
    url.searchParams.set("next", pathname);
    url.searchParams.set("reason", "parent-only");
    return NextResponse.redirect(url);
  }

  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) && !PUBLIC_PARENT.some((p) => pathname.startsWith(p));
  const isDemo = /^\/(topic|quiz|result)\//.test(pathname) && searchParams.get("demo") === "1";
  if (needsAuth && !isDemo && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + req.nextUrl.search);
    if (pathname.startsWith("/parent")) url.searchParams.set("as", "parent");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|brand/|favicon|icon|apple-touch|manifest).*)"],
};
