"use client";

import { useEffect } from "react";
import { saveWorkoutSnapshot } from "@/lib/offline-db";
import type { OfflineWorkoutPlan } from "@/lib/offline-types";

type OfflineWorkoutBootstrapProps = {
  plan: OfflineWorkoutPlan | null;
  streak: number;
};

export function OfflineWorkoutBootstrap({ plan, streak }: OfflineWorkoutBootstrapProps) {
  useEffect(() => {
    void saveWorkoutSnapshot({ savedAt: new Date().toISOString(), plan, streak }).catch(() => {
      // O treino continua funcionando online mesmo se o dispositivo não oferecer IndexedDB.
    });
  }, [plan, streak]);

  return null;
}
