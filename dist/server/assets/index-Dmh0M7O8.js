import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Plus, Sparkles } from "lucide-react";
import { a as useMenuByDate, C as CategoryBadge } from "./CategoryBadge-De7Ygx65.js";
import { c as cn, f as formatRupiah } from "./utils-FX9JXj3v.js";
import { u as useCart } from "./use-cart-CXnovB_z.js";
import { B as BottomNav } from "./BottomNav-WJ5dXbLh.js";
import { toast } from "sonner";
import "./router-VI3ubcTf.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
const logo = "/assets/logo-Dg8xanUZ.svg";
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function HomePage() {
  const {
    totalItems,
    add
  } = useCart();
  const today = useMemo(() => /* @__PURE__ */ new Date(), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const days = useMemo(() => {
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
  return /* @__PURE__ */ jsxs("div", { className: "pb-28", children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "size-9 rounded-xl bg-primary p-1", children: /* @__PURE__ */ jsx("img", { src: logo, alt: "Sekotak Bekal", className: "h-full w-full object-contain" }) }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-base font-bold", children: "Sekotak Bekal" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Catering makan setiap hari" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toast("Fitur pencarian segera hadir"), className: "grid size-10 place-items-center rounded-full text-foreground hover:bg-muted", "aria-label": "Cari menu", children: /* @__PURE__ */ jsx(Search, { className: "size-5" }) }),
        /* @__PURE__ */ jsxs(Link, { to: "/cart", className: "relative grid size-10 place-items-center rounded-full text-foreground hover:bg-muted", "aria-label": "Keranjang", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { className: "size-5" }),
          totalItems > 0 && /* @__PURE__ */ jsx("span", { className: "absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground", children: totalItems })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "px-4 pt-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-bold", children: "Pilih Tanggal" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Pesan untuk hari yang kamu mau" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground", children: monthLabel })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1", children: days.map((d, i) => {
        const active = i === activeIdx;
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setActiveIdx(i), className: cn("flex min-w-[58px] flex-col items-center rounded-2xl border px-3 py-3 transition-all", active ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30" : "border-border bg-surface text-foreground hover:border-primary/40"), children: [
          /* @__PURE__ */ jsx("span", { className: cn("text-[11px] font-medium", active ? "opacity-90" : "text-muted-foreground"), children: DAY_NAMES[d.getDay()] }),
          /* @__PURE__ */ jsx("span", { className: "mt-1 font-display text-xl font-bold", children: d.getDate() })
        ] }, i);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "px-4 pt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-bold", children: selectedDateLabel }),
        items.length > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success", children: [
          /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-success" }),
          "Tersedia"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: Array(4).fill(0).map((_, i) => /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-2xl bg-muted animate-pulse" }, i)) }) : error ? /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: "Gagal memuat menu" }) }) : items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Menu belum tersedia untuk hari ini" }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: items.map((m) => /* @__PURE__ */ jsxs("article", { className: "group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md", children: [
        /* @__PURE__ */ jsx(Link, { to: "/menu/$id", params: {
          id: m.id
        }, className: "block", children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-square overflow-hidden bg-muted", children: [
          m.image_url ? /* @__PURE__ */ jsx("img", { src: m.image_url, alt: m.name, width: 400, height: 400, loading: "lazy", className: "h-full w-full object-cover transition-transform group-hover:scale-105" }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-4xl", children: "🍲" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-2 top-2", children: /* @__PURE__ */ jsx(CategoryBadge, { category: m.category }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/menu/$id", params: {
            id: m.id
          }, children: /* @__PURE__ */ jsx("h3", { className: "line-clamp-1 font-display text-sm font-bold", children: m.name }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 line-clamp-1 text-[11px] text-muted-foreground", children: m.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-sm font-bold text-primary", children: formatRupiah(m.price) }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
              add(m.id, selectedDate, 1);
              toast.success(`${m.name} ditambahkan untuk ${selectedDateLabel}`);
            }, className: "grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform active:scale-90", "aria-label": `Tambah ${m.name}`, children: /* @__PURE__ */ jsx(Plus, { className: "size-4" }) })
          ] })
        ] })
      ] }, m.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "px-4 pt-6", children: /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft to-accent p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "size-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "Langganan Mingguan!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-foreground/70", children: "Diskon 15% untuk paket 5 hari kerja. Praktis & hemat." })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/auth", className: "self-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Coba" })
    ] }) }) }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
export {
  HomePage as component
};
