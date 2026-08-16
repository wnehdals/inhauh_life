"use client";

import { use, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CartButton } from "@/components/ui/CartButton";
import { addCartItem } from "@/lib/cart";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  subscribeSession,
} from "@/lib/session";
import {
  getCategoryBySlug,
  getMenuItem,
  SIZE_OPTIONS,
} from "@/lib/starbucks-menu";

const REQUEST_MAX = 50;

export default function StarbucksItemPage({
  params,
}: {
  params: Promise<{ slug: string; item: string }>;
}) {
  const { slug, item: itemParam } = use(params);
  const category = getCategoryBySlug(slug);
  const itemName = decodeURIComponent(itemParam);
  const item = category ? getMenuItem(slug, itemName) : undefined;
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const [sizeId, setSizeId] =
    useState<(typeof SIZE_OPTIONS)[number]["id"]>("tall");
  const [quantity, setQuantity] = useState(1);
  const [request, setRequest] = useState("");
  const [added, setAdded] = useState(false);

  if (!category || !item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-region-surface px-6 text-center">
        <p className="text-body text-secondary">상품을 찾을 수 없어요.</p>
        <Link href="/starbucks" className="text-body text-primary">
          카테고리 목록으로
        </Link>
      </div>
    );
  }

  const selectedSize = SIZE_OPTIONS.find((size) => size.id === sizeId)!;
  const unitPrice = item.price + selectedSize.extraPrice;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex flex-1 flex-col bg-region-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas px-4">
        <Link
          href={`/starbucks/${slug}`}
          aria-label="뒤로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-surface"
        >
          ←
        </Link>
        <h1 className="truncate text-h3 text-foreground">{item.name}</h1>
        <CartButton />
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-8">
        <div className="flex flex-row flex-1">
          <div
          className={`flex aspect-square max-w-60 max-h-60  w-full items-center justify-center rounded-content-card text-8xl shadow-floating ${category.tone}`}
        >
          {category.icon}
        </div>
        <div className="flex flex-col flex-1 ms-10">
          <p className="mt-2 text-caption text-secondary">{category.name}</p>
        <h2 className="mt-2 text-h1 text-foreground">{item.name}</h2>
        </div>
        

        </div>
        
        <section className="mt-8">
          <h3 className="text-h3 text-foreground">사이즈</h3>
          <div className="mt-3 flex gap-3">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSizeId(size.id)}
                className={`flex-1 rounded-action py-3 text-center text-body font-semibold transition-colors ${
                  size.id === sizeId
                    ? "bg-primary text-canvas"
                    : "bg-surface text-foreground"
                }`}
              >
                {size.label}
                {size.extraPrice > 0 && (
                  <span className="block text-caption font-normal opacity-80">
                    +{size.extraPrice.toLocaleString("ko-KR")}원
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-h3 text-foreground">수량</h3>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              aria-label="수량 감소"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-card bg-surface text-h3 text-foreground"
            >
              −
            </button>
            <span className="w-8 text-center text-h3 text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="수량 증가"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-card bg-surface text-h3 text-foreground"
            >
              +
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-h3 text-foreground">요청사항</h3>
          <textarea
            value={request}
            maxLength={REQUEST_MAX}
            onChange={(event) => setRequest(event.target.value)}
            placeholder="예: 얼음 적게 넣어주세요"
            rows={3}
            className="mt-3 w-full resize-none rounded-card border border-hairline bg-canvas p-4 text-body text-foreground placeholder:text-muted focus:outline-2 focus:outline-primary"
          />
          <p className="mt-1 text-right text-caption text-secondary">
            {request.length} / {REQUEST_MAX}
          </p>
        </section>
      </div>

      <div className="border-t border-hairline bg-canvas px-6 py-4">
        <button
          type="button"
          disabled={!session}
          onClick={() => {
            if (!session) return;
            addCartItem({
              roomId: session.roomId,
              categorySlug: slug,
              itemName: item.name,
              sizeLabel: selectedSize.label,
              quantity,
              requestNote: request,
              addedBy: session.userName,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-body font-semibold text-canvas transition-opacity hover:opacity-90 disabled:bg-surface disabled:text-muted"
        >
          {!session
            ? "방에 먼저 입장해주세요"
            : added
              ? "장바구니에 담았어요"
              : `장바구니 담기 · ${totalPrice.toLocaleString("ko-KR")}원`}
        </button>
      </div>
    </div>
  );
}
