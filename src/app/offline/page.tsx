import { AppShell } from "@/components/app-shell";
import { OfflineStatus } from "@/components/offline-status";
import { OfflineWorkoutView } from "@/components/offline-workout-view";

export default function OfflinePage() {
  return (
    <AppShell title="Treino offline" variant="student" showPageHeader={false} hideStudentTopBar>
      <OfflineStatus />
      <div className="mb-5">
        <p className="text-sm font-semibold text-apex-muted">Modo sem internet</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-apex-ink">Seu treino salvo</h1>
      </div>
      <OfflineWorkoutView />
    </AppShell>
  );
}
