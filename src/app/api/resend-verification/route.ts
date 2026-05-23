import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.emailVerified) {
    return NextResponse.json({ ok: true });
  }

  // Remove tokens antigos e cria novo
  await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

  const record = await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    }
  });

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const verifyUrl = `${protocol}://${host}/api/verify-email?token=${record.token}`;

  await sendVerificationEmail(user.email, user.name, verifyUrl);

  return NextResponse.json({ ok: true });
}
