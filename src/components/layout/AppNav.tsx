import Link from "next/link";
import { Map, Network, Sparkles, UsersRound, Clock3 } from "lucide-react";

const navItems = [
  { href: "/atlas", label: "章节热力", icon: Map },
  { href: "/timeline", label: "章节时间线", icon: Clock3 },
  { href: "/characters", label: "人物卡", icon: UsersRound },
  { href: "/relations", label: "关系附录", icon: Network },
];

export function AppNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#c8a45d24] bg-[#0d0b0acc] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded border border-[#c8a45d55] bg-[#c8a45d18]">
            <Sparkles size={17} color="#D6B76D" />
          </span>
          <span>
            <span className="serif-title block text-base tracking-[0.12em] text-[#f4ead4]">
              大观园情绪地图
            </span>
            <span className="hidden text-xs text-[#b9aa93] sm:block">
              Dream of the Red Chamber Emotional Atlas
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded px-2.5 py-2 text-xs text-[#d8c8ad] transition hover:bg-[#c8a45d14] hover:text-[#f6e8c8] sm:text-sm"
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
