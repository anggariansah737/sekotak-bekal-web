import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BvBN2c8W.js";
import { u as useAuth, s as supabase, L as Link } from "./router-7dEjMhRs.js";
import { c as createLucideIcon, f as formatRupiah } from "./utils-D47OA262.js";
import { C as ClipboardList, B as BottomNav } from "./BottomNav-C_UP7DrZ.js";
import { C as Calendar } from "./calendar-axCOvYGN.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$3 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$1);
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
    icon: CircleCheckBig
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-background px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Pesanan Saya" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-4 py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: "Silakan masuk terlebih dahulu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground", children: "Masuk" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-border bg-background px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Pesanan Saya" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Riwayat dan status pesananmu" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-4 pt-4", children: Array(3).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 rounded-2xl bg-muted animate-pulse" }, i)) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-20 place-items-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-9" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-lg font-bold", children: "Belum ada pesanan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-[260px] text-sm text-muted-foreground", children: "Pesanan kamu akan muncul di sini setelah checkout pertama." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground", children: "Mulai Pesan" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-4 pt-4", children: orders.map((order) => {
      const config = statusConfig[order.status] || statusConfig.menunggu_pembayaran;
      const StatusIcon = config.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm", children: [
              "Pesanan #",
              order.id.substring(0, 8).toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Dibuat",
              " ",
              new Date(order.created_at || "").toLocaleDateString("id-ID")
            ] }),
            order.delivery_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs font-medium text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-full p-2 ${config.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3 ${config.color}`, children: config.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1 mb-3", children: [
          order.items?.slice(0, 2).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            item.quantity,
            "× ",
            item.menu_items?.name || "Menu"
          ] }, item.id)),
          order.items && order.items.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs", children: [
            "+",
            order.items.length - 2,
            " item lainnya"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary", children: formatRupiah(order.total_amount) })
        ] })
      ] }, order.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  OrdersPage as component
};
