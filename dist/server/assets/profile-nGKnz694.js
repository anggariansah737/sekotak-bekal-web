import { U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import { u as useAuth, a as useNavigate, L as Link, t as toast } from "./router-DBnI-kIc.js";
import { U as User, B as BottomNav } from "./BottomNav-BZ_CTo6F.js";
import { c as createLucideIcon } from "./utils-DJdi3s0n.js";
import { H as Heart } from "./heart-4dPKQS1Y.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$5 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$5);
const __iconNode$4 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
const menuItems = [{
  icon: Heart,
  label: "Menu Favorit"
}, {
  icon: MapPin,
  label: "Alamat Pengiriman"
}, {
  icon: Bell,
  label: "Notifikasi"
}, {
  icon: CircleQuestionMark,
  label: "Bantuan"
}];
function ProfilePage() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar");
      navigate({
        to: "/"
      });
    } catch (err) {
      toast.error("Gagal keluar");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-background px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Profil" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-surface p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-14 place-items-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-bold", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.phone })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-bold", children: "Tamu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Masuk untuk pengalaman lebih lengkap" })
      ] }) }),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleLogout, className: "inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-3.5" }),
        " Keluar"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-3.5" }),
        " Masuk"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface", children: menuItems.map(({
      icon: Icon,
      label
    }) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-9 place-items-center rounded-xl bg-primary-soft text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
    ] }) }, label)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-center text-[11px] text-muted-foreground", children: "Sekotak Bekal v1.0 · Dibuat dengan ♥" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  ProfilePage as component
};
