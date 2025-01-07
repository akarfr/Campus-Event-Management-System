import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const path = request.nextUrl.pathname;

  const protectedRoutes = path == "/dashboard";

  if (protectedRoutes && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (protectedRoutes && session?.role != "ORGANIZER") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
