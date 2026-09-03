import type { OfflineWorkoutSnapshot } from "@/lib/offline-types";

const DATABASE_NAME = "apexfit-offline";
const DATABASE_VERSION = 1;
const SNAPSHOT_STORE = "workout-snapshots";
const SNAPSHOT_KEY = "current-student";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB não está disponível neste dispositivo."));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir o armazenamento offline."));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(SNAPSHOT_STORE)) {
        database.createObjectStore(SNAPSHOT_STORE);
      }
    };
  });
}

export async function saveWorkoutSnapshot(snapshot: Omit<OfflineWorkoutSnapshot, "key">) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(SNAPSHOT_STORE, "readwrite");
    transaction.objectStore(SNAPSHOT_STORE).put({ ...snapshot, key: SNAPSHOT_KEY }, SNAPSHOT_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível salvar o treino offline."));
  });
  database.close();
}

export async function loadWorkoutSnapshot(): Promise<OfflineWorkoutSnapshot | null> {
  const database = await openDatabase();
  const snapshot = await new Promise<OfflineWorkoutSnapshot | undefined>((resolve, reject) => {
    const request = database.transaction(SNAPSHOT_STORE, "readonly").objectStore(SNAPSHOT_STORE).get(SNAPSHOT_KEY);
    request.onsuccess = () => resolve(request.result as OfflineWorkoutSnapshot | undefined);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível ler o treino offline."));
  });
  database.close();
  return snapshot ?? null;
}

export async function clearOfflineData() {
  if (typeof window === "undefined" || !window.indexedDB) return;
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(SNAPSHOT_STORE, "readwrite");
    transaction.objectStore(SNAPSHOT_STORE).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Não foi possível limpar os dados offline."));
  });
  database.close();
}
