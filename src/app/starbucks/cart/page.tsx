"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import {
  clearCartForRoom,
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
} from "@/lib/cart";
import {
  getRoomsSnapshot,
  getServerRoomsSnapshot,
  removeRoom,
  subscribeRooms,
} from "@/lib/rooms";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  subscribeSession,
} from "@/lib/session";
import { getCategoryBySlug } from "@/lib/starbucks-menu";

export default function StarbucksCartPage() {
  const router = useRouter();
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
  const rooms = useSyncExternalStore(
    subscribeRooms,
    getRoomsSnapshot,
    getServerRoomsSnapshot,
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const room = session ? rooms.find((r) => r.id === session.roomId) : undefined;

  if (!session || !room) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-region-surface px-6 text-center">
        <p className="text-body text-secondary">입장한 방이 없어요.</p>
        <Link href="/starbucks/rooms" className="text-body text-primary">
          방 리스트로
        </Link>
      </div>
    );
  }

  const roomItems = cart.filter((item) => item.roomId === room.id);
  const addedNames = new Set(roomItems.map((item) => item.addedBy));
  const notAddedNames = room.allowedNames.filter(
    (name) => !addedNames.has(name),
  );

  function handleDeleteRoom() {
    clearCartForRoom(room!.id);
    removeRoom(room!.id);
    clearSession();
    setConfirmingDelete(false);
    router.push("/starbucks/rooms");
  }

  return (
    <div className="flex flex-1 flex-col bg-region-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas px-4">
        <Link
          href="/starbucks"
          aria-label="뒤로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-surface"
        >
          ←
        </Link>
        <h1 className="truncate text-h3 text-foreground">{room.name}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <h2 className="text-h1 text-foreground">장바구니</h2>
        <div className="mt-4 border-b border-hairline" />

        {roomItems.length === 0 ? (
          <p className="mt-8 text-body text-secondary">
            아직 담긴 메뉴가 없어요.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-6">
            {roomItems.map((item) => {
              const category = getCategoryBySlug(item.categorySlug);
              return (
                <li key={item.id} className="flex items-center gap-4">
                  <span
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-content-card text-3xl shadow-floating ${
                      category?.tone ?? "bg-surface"
                    }`}
                  >
                    {category?.icon ?? "🧾"}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-h3 text-foreground">
                      {item.itemName} · {item.sizeLabel}
                    </p>
                    <p className="text-body text-secondary">
                      수량 : {item.quantity}개
                    </p>
                    <p className="text-body text-secondary">
                      주문자 : {item.addedBy}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {room.allowedNames.length > 0 && (
          <section className="mt-10">
            <h3 className="text-h3 text-foreground">아직 담지 않은 사람</h3>
            {notAddedNames.length === 0 ? (
              <p className="mt-3 text-body text-secondary">모두 담았어요!</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {notAddedNames.map((name) => (
                  <Badge key={name} variant="warning">
                    {name}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}

        <Button
          type="button"
          variant="danger"
          className="mt-12 w-full"
          onClick={() => setConfirmingDelete(true)}
        >
          방 삭제
        </Button>
      </div>

      <Dialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="방을 삭제할까요?"
      >
        <p className="text-center text-body text-secondary">
          장바구니 내역도 함께 사라지고, 방 리스트로 돌아가요.
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-action"
            onClick={() => setConfirmingDelete(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1 rounded-action"
            onClick={handleDeleteRoom}
          >
            삭제
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
