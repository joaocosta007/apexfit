import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { authOptions, roleHomePath } from "@/lib/auth";

export async function requireRole(roles: Role | Role[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(roleHomePath[session.user.role]);
  }

  return session;
}