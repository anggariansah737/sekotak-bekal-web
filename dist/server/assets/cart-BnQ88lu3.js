import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import { a as useNavigate, u as useAuth, t as toast, L as Link, s as supabase } from "./router-DBnI-kIc.js";
import { u as useCart, a as useCartWithItems, P as Plus } from "./use-cart-CsMe0mC9.js";
import { c as createLucideIcon, f as formatRupiah } from "./utils-DJdi3s0n.js";
import { u as useMenu, S as ShoppingBag, C as CategoryBadge } from "./CategoryBadge-C0RChBOk.js";
import { C as Calendar } from "./calendar-BLKi5HI0.js";
import { M as Minus } from "./minus-D_F9hwcN.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const webhookUrl = "https://n8n-bahyqrvsn7n0.terong.sumopod.my.id/webhook/sekotak-order";
async function triggerOrderWebhook(payload) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
}
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function CartPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    items: menuItems
  } = useMenu();
  const {
    setQty,
    remove,
    clear,
    totalItems
  } = useCart();
  const {
    items,
    totalPrice,
    itemsByDate
  } = useCartWithItems(menuItems);
  const [loading, setLoading] = reactExports.useState(false);
  const dateGroupedItems = reactExports.useMemo(() => {
    const map = itemsByDate();
    return Array.from(map.entries()).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  }, [items]);
  const formatDateLabel = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return `${DAY_NAMES[d.getDay()]}, ${day} ${MONTH_NAMES[d.getMonth()]}`;
  };
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate({
        to: "/auth"
      });
      return;
    }
    if (items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }
    setLoading(true);
    try {
      const ordersByDate = /* @__PURE__ */ new Map();
      items.forEach((item) => {
        if (!ordersByDate.has(item.date)) {
          ordersByDate.set(item.date, []);
        }
        ordersByDate.get(item.date).push(item);
      });
      const createdOrders = [];
      for (const [deliveryDate, dateItems] of ordersByDate.entries()) {
        const dateTotal = dateItems.reduce((sum, l) => sum + l.qty * l.item.price, 0);
        const {
          data: orderData,
          error: orderError
        } = await supabase.from("orders").insert([{
          customer_id: user.id,
          total_amount: dateTotal,
          delivery_date: deliveryDate,
          status: "menunggu_pembayaran"
        }]).select();
        if (orderError) throw orderError;
        const order = orderData[0];
        createdOrders.push(order);
        const orderItems = dateItems.map((l) => ({
          order_id: order.id,
          menu_item_id: l.id,
          quantity: l.qty,
          price: l.item.price
        }));
        const {
          error: itemsError
        } = await supabase.from("order_items").insert(orderItems);
        if (itemsError) throw itemsError;
      }
      const ordersPayload = Array.from(ordersByDate.entries()).map(([deliveryDate, dateItems]) => ({
        deliveryDate,
        items: dateItems.map((l) => ({
          name: l.item.name,
          quantity: l.qty,
          price: l.item.price
        })),
        subtotal: dateItems.reduce((sum, l) => sum + l.qty * l.item.price, 0)
      }));
      await triggerOrderWebhook({
        customerName: user.name,
        customerPhone: user.phone,
        orders: ordersPayload,
        totalAmount: totalPrice,
        orderDate: (/* @__PURE__ */ new Date()).toISOString()
      });
      clear();
      toast.success("Pesanan berhasil dibuat!");
      navigate({
        to: "/orders"
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pb-40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => navigate({
        to: "/"
      }), className: "grid size-10 place-items-center rounded-full hover:bg-muted", "aria-label": "Tutup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-bold", children: "Keranjang" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
        if (items.length === 0) return;
        clear();
        toast("Keranjang dikosongkan");
      }, className: "text-xs font-semibold text-muted-foreground hover:text-destructive", children: "Hapus semua" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Keranjang Pesanan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: totalItems > 0 ? `${totalItems} item siap dipesan` : "Belum ada item dipilih" }),
      items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid size-20 place-items-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-9" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-lg font-bold", children: "Keranjangmu masih kosong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Yuk pilih menu favoritmu hari ini" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground", children: "Lihat Menu" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-5", children: dateGroupedItems.map(([deliveryDate, dateItems]) => {
          const dateTotal = dateItems.reduce((sum, l) => sum + l.qty * l.item.price, 0);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-surface p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold", children: formatDateLabel(deliveryDate) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: dateItems.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 rounded-xl border border-border/50 bg-background p-2", children: [
              l.item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: l.item.image_url, alt: l.item.name, width: 60, height: 60, loading: "lazy", className: "size-16 shrink-0 rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 shrink-0 rounded-lg bg-muted flex items-center justify-center text-lg", children: "🍲" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "line-clamp-1 font-display text-xs font-bold", children: l.item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: l.item.category }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => remove(l.id, deliveryDate), className: "grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive", "aria-label": "Hapus", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-end justify-between pt-1.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary", children: formatRupiah(l.item.price * l.qty) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full border border-border bg-background/50 px-1 py-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQty(l.id, deliveryDate, l.qty - 1), className: "grid size-5 place-items-center rounded-full bg-muted hover:bg-muted-foreground/20", "aria-label": "Kurangi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-2.5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 text-center font-bold", children: l.qty }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQty(l.id, deliveryDate, l.qty + 1), className: "grid size-5 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90", "aria-label": "Tambah", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5" }) })
                  ] })
                ] })
              ] })
            ] }, `${l.id}-${deliveryDate}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 border-t border-border/50 pt-3 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground", children: [
                "Subtotal:",
                " "
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-primary", children: formatRupiah(dateTotal) })
            ] })
          ] }, deliveryDate);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 rounded-2xl border border-border bg-surface p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold", children: "Rincian Pembayaran" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dt", { children: [
                "Total Item (",
                totalItems,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-foreground", children: formatRupiah(totalPrice) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Biaya Pengiriman" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-success", children: "Gratis" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 border-t border-dashed border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-display text-base font-bold", children: "Total Pembayaran" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-display text-xl font-bold text-primary", children: formatRupiah(totalPrice) })
            ] })
          ] })
        ] })
      ] })
    ] }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "fixed inset-x-0 bottom-0 z-30 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleCheckout, disabled: loading, className: "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98] disabled:opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-5" }),
      loading ? "Memproses..." : "Konfirmasi Pesanan"
    ] }) }) })
  ] });
}
export {
  CartPage as component
};
