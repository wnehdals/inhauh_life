import Link from "next/link";
import { CartButton } from "@/components/ui/CartButton";
import { STARBUCKS_CATEGORIES } from "@/lib/starbucks-menu";

export default function StarbucksPage() {
  const drinkCategories = STARBUCKS_CATEGORIES.filter(
    (category) => category.section === "drink",
  );
  const foodCategories = STARBUCKS_CATEGORIES.filter(
    (category) => category.section === "food",
  );

  return (
    <div className="flex flex-1 flex-col bg-region-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas px-4">
        <Link
          href="/starbucks/rooms"
          aria-label="방 리스트로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-surface"
        >
          ←
        </Link>
        <h1 className="text-h3 text-foreground">스타벅스 메뉴</h1>
        <CartButton />
      </header>

      <div className="flex-1 px-6 py-8">
        <section>
          <p className="text-caption text-secondary">Order</p>
          <h2 className="mt-1 text-h1 text-foreground">음료</h2>
          <ul className="mt-4 flex flex-col divide-y divide-hairline">
            {drinkCategories.map((category) => (
              <CategoryRow key={category.slug} category={category} />
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-h1 text-foreground">푸드</h2>
          <ul className="mt-4 flex flex-col divide-y divide-hairline">
            {foodCategories.map((category) => (
              <CategoryRow key={category.slug} category={category} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function CategoryRow({
  category,
}: {
  category: (typeof STARBUCKS_CATEGORIES)[number];
}) {
  return (
    <li>
      <Link
        href={`/starbucks/${category.slug}`}
        className="flex items-center gap-4 py-3"
      >
        <span
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-content-card text-2xl shadow-floating ${category.tone}`}
        >
          {category.icon}
        </span>
        <span className="text-h3 text-foreground">{category.name}</span>
      </Link>
    </li>
  );
}
