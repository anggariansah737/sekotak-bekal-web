import { Link, useLocation } from "@tanstack/react-router";
import { Home, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Menu", icon: Home },
  { to: "/orders", label: "Pesanan", icon: ClipboardList },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="pointer-events-auto mx-auto w-full max-w-[480px] border-t border-border bg-surface/95 px-4 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
        <ul className="grid grid-cols-3">
          {items.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-5", active && "stroke-[2.5]")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
