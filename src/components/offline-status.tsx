"use client";

import { CloudOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed left-1/2 top-2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-apex-navy px-3 py-2 text-xs font-bold text-white shadow-floating" role="status">
      <CloudOff className="h-4 w-4" aria-hidden="true" />
      Sem internet · usando treino salvo
    </div>
  );
}
