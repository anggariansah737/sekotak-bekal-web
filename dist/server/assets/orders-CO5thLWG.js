import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Package, Truck, CheckCircle, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { u as useAuth, s as supabase } from "./router-VI3ubcTf.js";
import { f as formatRupiah } from "./utils-FX9JXj3v.js";
import { B as BottomNav } from "./BottomNav-WJ5dXbLh.js";
import "sonner";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    supabase.from("orders").select("*, order_items(*, menu_items(*))").eq("customer_id", user.id).order("created_at", { ascending: false }).then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setOrders(data ?? []);
      setLoading(false);
    });
  }, [user]);
  return { orders, loading, error };
}
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const statusConfig = {
  menunggu_pembayaran: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock
  },
  dikonfirmasi: {
    label: "Dikonfirmasi",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle
  },
  dikirim: {
    label: "Dalam Pengiriman",
    color: "bg-orange-100 text-orange-700",
    icon: Truck
  },
  selesai: {
    label: "Selesai",
    color: "bg-green-100 text-green-700",
    icon: Package
  }
};
function OrdersPage() {
  const {
    user
  } = useAuth();
  const {
    orders,
    loading
  } = useOrders();
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-28", children: [
      /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-background px-4 py-4", children: /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Pesanan Saya" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center px-4 py-20 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-lg font-bold", children: "Silakan masuk terlebih dahulu" }),
        /* @__PURE__ */ jsx(Link, { to: "/auth", className: "mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground", children: "Masuk" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-28", children: [
    /* @__PURE__ */ jsxs("header", { className: "border-b border-border bg-background px-4 py-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Pesanan Saya" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Riwayat dan status pesananmu" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "space-y-3 px-4 pt-4", children: Array(3).fill(0).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-24 rounded-2xl bg-muted animate-pulse" }, i)) }) : orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "grid size-20 place-items-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx(ClipboardList, { className: "size-9" }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 font-display text-lg font-bold", children: "Belum ada pesanan" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-[260px] text-sm text-muted-foreground", children: "Pesanan kamu akan muncul di sini setelah checkout pertama." }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground", children: "Mulai Pesan" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3 px-4 pt-4", children: orders.map((order) => {
      const config = statusConfig[order.status] || statusConfig.menunggu_pembayaran;
      const StatusIcon = config.icon;
      return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-display font-bold text-sm", children: [
              "Pesanan #",
              order.id.substring(0, 8).toUpperCase()
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Dibuat",
              " ",
              new Date(order.created_at || "").toLocaleDateString("id-ID")
            ] }),
            order.delivery_date && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs font-medium text-primary", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "size-3" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Pengiriman",
                " ",
                (() => {
                  const [year, month, day] = order.delivery_date.split("-").map(Number);
                  const d = new Date(year, month - 1, day);
                  return `${DAY_NAMES[d.getDay()]}, ${day} ${MONTH_NAMES[d.getMonth()]}`;
                })()
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: `rounded-full p-2 ${config.color}`, children: /* @__PURE__ */ jsx(StatusIcon, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3 ${config.color}`, children: config.label }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1 mb-3", children: [
          order.items?.slice(0, 2).map((item) => /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
            item.quantity,
            "× ",
            item.menu_items?.name || "Menu"
          ] }, item.id)),
          order.items && order.items.length > 2 && /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
            "+",
            order.items.length - 2,
            " item lainnya"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "font-display font-bold text-primary", children: formatRupiah(order.total_amount) })
        ] })
      ] }, order.id);
    }) }),
    /* @__PURE__ */ jsx(BottomNav, {})
  ] });
}
export {
  OrdersPage as component
};
