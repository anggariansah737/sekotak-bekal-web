import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import { t as toast, L as Link } from "./router-DBnI-kIc.js";
import { a as useMenuByDate, S as ShoppingBag, C as CategoryBadge } from "./CategoryBadge-C0RChBOk.js";
import { c as createLucideIcon, a as cn, f as formatRupiah } from "./utils-DJdi3s0n.js";
import { u as useCart, P as Plus } from "./use-cart-CsMe0mC9.js";
import { B as BottomNav } from "./BottomNav-BZ_CTo6F.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const logo = "/assets/logo-Dg8xanUZ.svg";
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function HomePage() {
  const {
    totalItems,
    add
  } = useCart();
  const today = reactExports.useMemo(() => /* @__PURE__ */ new Date(), []);
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const days = reactExports.useMemo(() => {
    return Array.from({
      length: 7
    }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [today]);
  const selectedDate = days[activeIdx].toISOString().split("T")[0];
  const {
    items,
    loading,
    error
  } = useMenuByDate(selectedDate);
  const monthLabel = `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;
  const selectedDateLabel = `${DAY_NAMES[days[activeIdx].getDay()]}, ${days[activeIdx].getDate()} ${MONTH_NAMES[days[activeIdx].getMonth()]}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-primary p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Sekotak Bekal", className: "h-full w-full object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-bold", children: "Sekotak Bekal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Catering makan setiap hari" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toast("Fitur pencarian segera hadir"), className: "grid size-10 place-items-center rounded-full text-foreground hover:bg-muted", "aria-label": "Cari menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative grid size-10 place-items-center rounded-full text-foreground hover:bg-muted", "aria-label": "Keranjang", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-5" }),
          totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground", children: totalItems })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-4 pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Pilih Tanggal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pesan untuk hari yang kamu mau" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: monthLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1", children: days.map((d, i) => {
        const active = i === activeIdx;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveIdx(i), className: cn("flex min-w-[58px] flex-col items-center rounded-2xl border px-3 py-3 transition-all", active ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30" : "border-border bg-surface text-foreground hover:border-primary/40"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[11px] font-medium", active ? "opacity-90" : "text-muted-foreground"), children: DAY_NAMES[d.getDay()] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 font-display text-xl font-bold", children: d.getDate() })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-4 pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: selectedDateLabel }),
        items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-success" }),
          "Tersedia"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: Array(4).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-2xl bg-muted animate-pulse" }, i)) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: "Gagal memuat menu" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Menu belum tersedia untuk hari ini" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: items.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu/$id", params: {
          id: m.id
        }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden bg-muted", children: [
          m.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: m.image_url, alt: m.name, width: 400, height: 400, loading: "lazy", className: "h-full w-full object-cover transition-transform group-hover:scale-105" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-4xl", children: "🍲" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-2 top-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: m.category }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu/$id", params: {
            id: m.id
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "line-clamp-1 font-display text-sm font-bold", children: m.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-1 text-[11px] text-muted-foreground", children: m.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-primary", children: formatRupiah(m.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              add(m.id, selectedDate, 1);
              toast.success(`${m.name} ditambahkan untuk ${selectedDateLabel}`);
            }, className: "grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform active:scale-90", "aria-label": `Tambah ${m.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }) })
          ] })
        ] })
      ] }, m.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft to-accent p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "Langganan Mingguan!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-foreground/70", children: "Diskon 15% untuk paket 5 hari kerja. Praktis & hemat." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "self-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Coba" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  HomePage as component
};
