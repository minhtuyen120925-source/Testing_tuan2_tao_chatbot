"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import React from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Điểm chuẩn trường", href: "#" },
  { name: "Cổng hồ sơ", href: "/portal" },
  { name: "Admin", href: "/admin" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <nav className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link href="/" aria-label="Về trang chủ" className="flex items-center">
            <Logo uniColor />
          </Link>

          <ul className="hidden items-center gap-8 text-sm lg:flex">
            {menuItems.map((item) => {
              const active = item.href !== "#" && pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block duration-150 hover:text-foreground",
                      active ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            className="relative z-20 flex size-9 items-center justify-center rounded-md text-foreground lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen && (
          <ul className="space-y-1 border-t py-4 lg:hidden">
            {menuItems.map((item) => {
              const active = item.href !== "#" && pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block rounded-md px-2 py-2.5 text-base duration-150",
                      active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
