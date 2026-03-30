import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register"];

  const isPublic = publicRoutes.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/budgets/:path*", "/transactions/:path*","/pots/:path*", "/bills/:path*"],
};