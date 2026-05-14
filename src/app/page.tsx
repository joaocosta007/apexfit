import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, roleHomePath } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/login");
  }

  redirect(roleHomePath[session.user.role]);
}