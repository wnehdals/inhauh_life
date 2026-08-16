import starbucksMenu from "@/data/starbucks-menu.json";

export type MenuItem = {
  name: string;
  price: number;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type StarbucksMenu = {
  categories: MenuCategory[];
};

export function getStarbucksMenu(): StarbucksMenu {
  return starbucksMenu;
}

export type CategorySection = "drink" | "food";

export type StarbucksCategory = {
  slug: string;
  name: string;
  icon: string;
  tone: string;
  section: CategorySection;
};

export const STARBUCKS_CATEGORIES: StarbucksCategory[] = [
  { slug: "espresso", name: "에스프레소/커피", icon: "☕", tone: "bg-primary", section: "drink" },
  { slug: "decaf", name: "디카페인 커피", icon: "🌙", tone: "bg-success", section: "drink" },
  { slug: "brewed", name: "블로드 커피", icon: "🫖", tone: "bg-warning", section: "drink" },
  { slug: "cold-brew", name: "콜드블루", icon: "🧊", tone: "bg-danger", section: "drink" },
  { slug: "frappuccino", name: "프라푸치노/블렌디드", icon: "🥤", tone: "bg-primary", section: "drink" },
  { slug: "tea", name: "티 음료", icon: "🍵", tone: "bg-success", section: "drink" },
  { slug: "fizzio", name: "피지오/리프레셔", icon: "🍹", tone: "bg-warning", section: "drink" },
  { slug: "trenta", name: "Trenta", icon: "🧃", tone: "bg-danger", section: "drink" },
  { slug: "to-go-bag", name: "To Go Bag", icon: "🛍️", tone: "bg-primary", section: "food" },
  { slug: "sandwiches", name: "샌드위치", icon: "🥪", tone: "bg-success", section: "food" },
  { slug: "cakes", name: "케이크/미니디저트", icon: "🍰", tone: "bg-warning", section: "food" },
  { slug: "bread", name: "브레드", icon: "🥐", tone: "bg-danger", section: "food" },
  { slug: "snacks", name: "스낵/쿠키", icon: "🍪", tone: "bg-primary", section: "food" },
  { slug: "chocolate", name: "초콜릿/캔디", icon: "🍫", tone: "bg-success", section: "food" },
  {
    slug: "fruit-yogurt",
    name: "과일/요거트/아이스크림",
    icon: "🍨",
    tone: "bg-warning",
    section: "food",
  },
];

// Maps each real item already in starbucks-menu.json to one of the 15
// categories above. Items with no obvious match are left uncategorized.
const ITEM_CATEGORY_SLUG: Record<string, string> = {
  아메리카노: "espresso",
  "카페 라떼": "espresso",
  카푸치노: "espresso",
  "바닐라 라떼": "espresso",
  "카라멜 마키아또": "espresso",
  "콜드 브루": "cold-brew",
  "그린티 라떼": "tea",
  "자몽 허니 블랙티": "tea",
  "초콜릿 클래식": "tea",
  "패션 탱고 피지오": "fizzio",
  "유자 민트 티": "tea",
  "치즈 케이크": "cakes",
  크루아상: "bread",
  베이글: "bread",
  샌드위치: "sandwiches",
  스콘: "bread",
};

export function getCategoryItems(slug: string): MenuItem[] {
  const { categories } = getStarbucksMenu();
  return categories
    .flatMap((category) => category.items)
    .filter((item) => ITEM_CATEGORY_SLUG[item.name] === slug);
}

export function getCategoryBySlug(slug: string): StarbucksCategory | undefined {
  return STARBUCKS_CATEGORIES.find((category) => category.slug === slug);
}

export function getMenuItem(
  categorySlug: string,
  itemName: string,
): MenuItem | undefined {
  return getCategoryItems(categorySlug).find(
    (item) => item.name === itemName,
  );
}

export const SIZE_OPTIONS = [
  { id: "tall", label: "톨", extraPrice: 0 },
  { id: "grande", label: "그란데", extraPrice: 500 },
  { id: "venti", label: "벤티", extraPrice: 1000 },
] as const;
