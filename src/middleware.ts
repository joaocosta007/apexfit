import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
  MANAGER: "/manager",
  TRAINER: "/trainer",
  STUDENT: "/student/workouts/today",
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Redireciona "/" para a página correta conforme o papel do usuário
  if (pathname === "/") {
    if (token?.role) {
      const home = ROLE_HOME[token.role as string] ?? "/login";
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protege rotas por papel — redireciona para login se não autenticado
  const isStudentRoute  = pathname.startsWith("/student");
  const isTrainerRoute  = pathname.startsWith("/trainer");
  const isManagerRoute  = pathname.startsWith("/manager");

  if (isStudentRoute || isTrainerRoute || isManagerRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    if (isStudentRoute && role !== "STUDENT") {
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
    }
    if (isTrainerRoute && role !== "TRAINER") {
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
    }
    if (isManagerRoute && role !== "MANAGER") {
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas, exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon / ícones / manifesto / service worker
     * - API do NextAuth (não pode redirecionar o callback de login)
     */
    "/((?!_next/static|_next/image|favicon|icon|manifest|sw\\.js|api/auth).*)",
  ],
};
