export type Room = {
  id: string;
  name: string;
  allowedNames: string[];
  createdAt: string;
};

const STORAGE_KEY = "starbucks-rooms";
const listeners = new Set<() => void>();
let cachedRooms: Room[] | null = null;

function readFromStorage(): Room[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Room[]) : [];
  } catch {
    return [];
  }
}

function setRooms(rooms: Room[]): void {
  cachedRooms = rooms;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }
  listeners.forEach((listener) => listener());
}

export function subscribeRooms(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRoomsSnapshot(): Room[] {
  if (cachedRooms === null) {
    cachedRooms = readFromStorage();
  }
  return cachedRooms;
}

export function getServerRoomsSnapshot(): Room[] {
  return [];
}

export function parseAllowedNames(raw: string): string[] {
  return raw
    .split("/")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

export function addRoom(name: string, allowedNamesRaw: string): Room {
  const room: Room = {
    id: crypto.randomUUID(),
    name,
    allowedNames: parseAllowedNames(allowedNamesRaw),
    createdAt: new Date().toISOString(),
  };
  setRooms([...getRoomsSnapshot(), room]);
  return room;
}

export function removeRoom(id: string): void {
  setRooms(getRoomsSnapshot().filter((room) => room.id !== id));
}
