import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // const accessToken = req.cookies.get("accessToken")?.value;
  // const url = req.nextUrl;
  //
  // const isProtected = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/features");
  //
  // if (!isProtected) {
  //   return NextResponse.next();
  // }
  //
  // if (accessToken) {
  //   return NextResponse.next();
  // }
  //
  // return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/features/:path*"],
};
