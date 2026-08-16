export type StarbucksSession = {
  roomId: string;
  userName: string;
} | null;

const STORAGE_KEY = "starbucks-session";
const listeners = new Set<() => void>();
let cachedSession: StarbucksSession | undefined;

function readFromStorage(): StarbucksSession {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StarbucksSession) : null;
  } catch {
    return null;
  }
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSessionSnapshot(): StarbucksSession {
  if (cachedSession === undefined) {
    cachedSession = readFromStorage();
  }
  return cachedSession;
}

export function getServerSessionSnapshot(): StarbucksSession {
  return null;
}

export function setSession(session: StarbucksSession): void {
  cachedSession = session;
  if (typeof window !== "undefined") {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
  listeners.forEach((listener) => listener());
}

export function clearSession(): void {
  setSession(null);
}
