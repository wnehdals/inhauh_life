"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
} from "@/lib/cart";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  subscribeSession,
} from "@/lib/session";

export function CartButton() {
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const count = session
    ? cart
        .filter((item) => item.roomId === session.roomId)
        .reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/starbucks/cart"
      aria-label="장바구니"
      className="relative ml-auto flex h-9 w-9 items-center justify-center rounded-full text-lg text-secondary hover:bg-surface"
    >
      🛒
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-canvas">
          {count}
        </span>
      )}
    </Link>
  );
}
