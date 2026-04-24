import { jsx, jsxs } from "react/jsx-runtime";
import { useLocation, Link } from "@tanstack/react-router";
import { Home, ClipboardList, User } from "lucide-react";
import { c as cn } from "./utils-FX9JXj3v.js";
const items = [
  { to: "/", label: "Menu", icon: Home },
  { to: "/orders", label: "Pesanan", icon: ClipboardList },
  { to: "/profile", label: "Profil", icon: User }
];
function BottomNav() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsx("nav", { className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-auto mx-auto w-full max-w-[480px] border-t border-border bg-surface/95 px-4 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur", children: /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-3", children: items.map(({ to, label, icon: Icon }) => {
    const active = pathname === to;
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
      Link,
      {
        to,
        className: cn(
          "flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsx(Icon, { className: cn("size-5", active && "stroke-[2.5]") }),
          label
        ]
      }
    ) }, to);
  }) }) }) });
}
export {
  BottomNav as B
};
