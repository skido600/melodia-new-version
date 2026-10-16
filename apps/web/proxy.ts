import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/doc", "/profile", "/search"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // refreshToken lives 7 days, accessToken only 15 min
  const isLoggedIn =
    Boolean(request.cookies.get("refreshToken")?.value) ||
    Boolean(request.cookies.get("accessToken")?.value);

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // not logged in -> cannot open protected pages
  if (isProtected && !isLoggedIn) {
    const url = new URL("/signup", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authorized/:path*", "/login"],
};
