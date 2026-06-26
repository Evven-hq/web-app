import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent")?.toLowerCase() ?? "";

  const isDesktop =
    ua.includes("pake") ||
    ua.includes("tauri") ||
    ua.includes("evven");

  if (
    isDesktop &&
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.redirect(
      new URL("/desktop", request.url)
    );
  }

  return NextResponse.next();
}