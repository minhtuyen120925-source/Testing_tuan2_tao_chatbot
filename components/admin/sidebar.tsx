"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileClock,
  LayoutDashboard,
  MessageSquare,
  School,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export const adminNavItems: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Yêu cầu", href: "/admin/requests", icon: FileClock },
  { name: "Trường tham chiếu", href: "/admin/schools", icon: School },
  { name: "Hồ sơ học viên", href: "/admin/profiles", icon: Users },
  { name: "Hội thoại", href: "/admin/conversations", icon: MessageSquare },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
      <div className="border-b px-5 py-5">
        <Link href="/">
          <Logo uniColor />
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Admin dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {adminNavItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm duration-150",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          Xem trang khách ↗
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-sidebar px-3 py-2 lg:hidden">
      {adminNavItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs duration-150",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
