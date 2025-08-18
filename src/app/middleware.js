// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const userRole = token?.role; // ejemplo decodificado

  const url = req.nextUrl.pathname;

  if (url.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (url.startsWith("/organizador") && userRole !== "organizador") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  return NextResponse.next();
}
