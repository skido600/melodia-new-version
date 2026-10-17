import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/doc", "/profile", "/search"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn =
    Boolean(request.cookies.get("refreshToken")?.value) ||
    Boolean(request.cookies.get("accessToken")?.value);

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected && !isLoggedIn) {
    const url = new URL("/signup", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/doc/:path*",
    "/profile/:path*",
    "/search/:path*",
  ],
};
