"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearOfflineData } from "@/lib/offline-db";

export function LogoutButton() {
  async function handleLogout() {
    await clearOfflineData().catch(() => undefined);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Sair" onClick={handleLogout}>
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
