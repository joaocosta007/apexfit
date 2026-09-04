import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { Role } from "@prisma/client";
import { authOptions, roleHomePath } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireRole(roles: Role | Role[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(roleHomePath[session.user.role]);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true }
  });

  if (!user || !user.isActive) {
    redirect("/login");
  }

  return session;
}

export async function requireActiveSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true }
  });

  if (!user || !user.isActive) return null;
  return session;
}