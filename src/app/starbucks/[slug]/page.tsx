import Link from "next/link";
import { notFound } from "next/navigation";
import { CartButton } from "@/components/ui/CartButton";
import { getCategoryBySlug, getCategoryItems } from "@/lib/starbucks-menu";

export default async function StarbucksCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = getCategoryItems(slug);

  return (
    <div className="flex flex-1 flex-col bg-region-surface">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-canvas px-4">
        <Link
          href="/starbucks"
          aria-label="카테고리 목록으로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-surface"
        >
          ←
        </Link>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-card text-lg ${category.tone}`}
        >
          {category.icon}
        </span>
        <h1 className="text-h3 text-foreground">{category.name}</h1>
        <CartButton />
      </header>

      <div className="flex-1 px-6 py-8">
        <h2 className="text-h1 text-foreground">{category.name}</h2>
        <div className="mt-4 border-b border-hairline" />

        {items.length === 0 ? (
          <p className="mt-16 text-center text-body text-secondary">
            메뉴 준비 중이에요.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.name}>
                <Link
                  href={`/starbucks/${slug}/${encodeURIComponent(item.name)}`}
                  className="flex items-center gap-4"
                >
                  <span
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-content-card text-4xl shadow-floating ${category.tone}`}
                  >
                    {category.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-h3 text-foreground">{item.name}</p>
                    <p className="text-body text-secondary">
                      {item.price.toLocaleString("ko-KR")}원
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
