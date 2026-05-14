import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

const protectedRoutes: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/manager", roles: ["MANAGER"] },
  { prefix: "/trainer", roles: ["TRAINER"] },
  { prefix: "/student", roles: ["STUDENT"] }
];

export default withAuth(
  function middleware(req: NextRequest & { nextauth: { token: { role?: Role } | null } }) {
    const pathname = req.nextUrl.pathname;
    const matchedRoute = protectedRoutes.find((route) => pathname.startsWith(route.prefix));

    if (!matchedRoute) {
      return NextResponse.next();
    }

    const role = req.nextauth.token?.role;

    if (!role || !matchedRoute.roles.includes(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("erro", "acesso-negado");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token)
    },
    pages: {
      signIn: "/login"
    }
  }
);

export const config = {
  matcher: ["/manager/:path*", "/trainer/:path*", "/student/:path*"]
};