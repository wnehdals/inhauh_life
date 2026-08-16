export type CartItem = {
  id: string;
  roomId: string;
  categorySlug: string;
  itemName: string;
  sizeLabel: string;
  quantity: number;
  requestNote: string;
  addedBy: string;
  addedAt: string;
};

const STORAGE_KEY = "starbucks-cart";
const listeners = new Set<() => void>();
let cachedCart: CartItem[] | null = null;

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function setCart(items: CartItem[]): void {
  cachedCart = items;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((listener) => listener());
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartItem[] {
  if (cachedCart === null) {
    cachedCart = readFromStorage();
  }
  return cachedCart;
}

export function getServerCartSnapshot(): CartItem[] {
  return [];
}

export function addCartItem(entry: Omit<CartItem, "id" | "addedAt">): CartItem {
  const item: CartItem = {
    ...entry,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  setCart([...getCartSnapshot(), item]);
  return item;
}

export function getCartItemsForRoom(roomId: string): CartItem[] {
  return getCartSnapshot().filter((item) => item.roomId === roomId);
}

export function clearCartForRoom(roomId: string): void {
  setCart(getCartSnapshot().filter((item) => item.roomId !== roomId));
}
