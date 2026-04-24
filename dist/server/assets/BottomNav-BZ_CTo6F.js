import { M as useRouter, U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import { L as Link } from "./router-DBnI-kIc.js";
import { c as createLucideIcon, a as cn } from "./utils-DJdi3s0n.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$2 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const items = [
  { to: "/", label: "Menu", icon: House },
  { to: "/orders", label: "Pesanan", icon: ClipboardList },
  { to: "/profile", label: "Profil", icon: User }
];
function BottomNav() {
  const { pathname } = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto mx-auto w-full max-w-[480px] border-t border-border bg-surface/95 px-4 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-3", children: items.map(({ to, label, icon: Icon }) => {
    const active = pathname === to;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: cn(
          "flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors",
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("size-5", active && "stroke-[2.5]") }),
          label
        ]
      }
    ) }, to);
  }) }) }) });
}
export {
  BottomNav as B,
  ClipboardList as C,
  User as U
};
