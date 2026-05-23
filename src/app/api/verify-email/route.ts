import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?erro=token-invalido", request.url));
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token }
  });

  if (!record) {
    return NextResponse.redirect(new URL("/login?erro=token-invalido", request.url));
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/login?erro=token-expirado", request.url));
  }

  // Marca e-mail como verificado e remove o token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() }
    }),
    prisma.emailVerificationToken.delete({ where: { token } })
  ]);

  return NextResponse.redirect(new URL("/login?verificado=ok", request.url));
}
