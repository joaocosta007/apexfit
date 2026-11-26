"use client";

import { useEffect } from "react";

export function ServiceWorkerInit() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => caches.keys())
        .then((keys) =>
          Promise.all(keys.filter((key) => key.startsWith("apexfit-")).map((key) => caches.delete(key)))
        )
        .catch(console.error);
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(console.error);
  }, []);

  return null;
}
