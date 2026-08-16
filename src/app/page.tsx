import Image from "next/image";
import Link from "next/link";

const apps = [
  {
    href: "/meals",
    label: "식단표",
    icon: "🍽️",
    iconSrc: undefined,
    tone: "bg-primary",
  },
  {
    href: "/starbucks/rooms",
    label: "스타벅스",
    icon: "☕",
    iconSrc: "/starbucks.png",
    tone: "bg-canvas",
  },
] as const;

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-region-surface">
      <Image
        src="/inahauh_logo.svg"
        alt=""
        aria-hidden="true"
        width={478}
        height={478}
        className="pointer-events-none absolute top-1/2 left-1/2 h-auto w-[50%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.06] sm:w-112"
      />

      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-hairline bg-canvas">
        <h1 className="text-h3 text-foreground">병원 라이프</h1>
      </header>

      <div className="relative grid grid-cols-4 gap-x-4 gap-y-6 px-6 py-8">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-content-card text-2xl shadow-floating ${app.tone}`}
            >
              {app.iconSrc ? (
                <Image
                  src={app.iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                app.icon
              )}
            </span>
            <span className="text-caption text-foreground">{app.label}</span>
          </Link>
        ))}

        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-2 opacity-60"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-content-card border-2 border-dashed border-muted text-2xl text-muted">
            +
          </span>
          <span className="text-caption text-secondary">추가 예정</span>
        </div>
      </div>
    </div>
  );
}
