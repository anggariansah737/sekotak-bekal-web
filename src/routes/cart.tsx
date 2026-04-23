import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useCart, useCartWithItems } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { useMenu } from "@/hooks/use-menu";
import { useAuth } from "@/context/AuthContext";
import { CategoryBadge } from "@/components/CategoryBadge";
import { supabase } from "@/lib/supabase";
import { triggerOrderWebhook } from "@/lib/n8n";
import { toast } from "sonner";

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [{ title: "Keranjang Pesanan — Sekotak Bekal" }],
  }),
});

function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: menuItems } = useMenu();
  const { lines, setQty, remove, clear, totalItems } = useCart();
  const { items, totalPrice, itemsByDate } = useCartWithItems(menuItems);
  const [loading, setLoading] = useState(false);

  const dateGroupedItems = useMemo(() => {
    const map = itemsByDate();
    return Array.from(map.entries()).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB),
    );
  }, [items]);

  const formatDateLabel = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return `${DAY_NAMES[d.getDay()]}, ${day} ${MONTH_NAMES[d.getMonth()]}`;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate({ to: "/auth" });
      return;
    }
    if (items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setLoading(true);
    try {
      // Group items by delivery date and create orders
      const ordersByDate = new Map<string, typeof items>();
      items.forEach((item) => {
        if (!ordersByDate.has(item.date)) {
          ordersByDate.set(item.date, []);
        }
        ordersByDate.get(item.date)!.push(item);
      });

      const createdOrders = [];

      for (const [deliveryDate, dateItems] of ordersByDate.entries()) {
        const dateTotal = dateItems.reduce(
          (sum, l) => sum + l.qty * l.item.price,
          0,
        );

        // Create order for this delivery date
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert([
            {
              customer_id: user.id,
              total_amount: dateTotal,
              delivery_date: deliveryDate,
              status: "menunggu_pembayaran",
            },
          ])
          .select();

        if (orderError) throw orderError;

        const order = orderData[0];
        createdOrders.push(order);

        // Create order items for this order
        const orderItems = dateItems.map((l) => ({
          order_id: order.id,
          menu_item_id: l.id,
          quantity: l.qty,
          price: l.item.price,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
        if (itemsError) throw itemsError;
      }

      // Trigger n8n webhook with all orders grouped by date
      const ordersPayload = Array.from(ordersByDate.entries()).map(
        ([deliveryDate, dateItems]) => ({
          deliveryDate,
          items: dateItems.map((l) => ({
            name: l.item.name,
            quantity: l.qty,
            price: l.item.price,
          })),
          subtotal: dateItems.reduce((sum, l) => sum + l.qty * l.item.price, 0),
        }),
      );

      await triggerOrderWebhook({
        customerName: user.name,
        customerPhone: user.phone,
        orders: ordersPayload,
        totalAmount: totalPrice,
        orderDate: new Date().toISOString(),
      });

      clear();
      toast.success("Pesanan berhasil dibuat!");
      navigate({ to: "/orders" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="grid size-10 place-items-center rounded-full hover:bg-muted"
          aria-label="Tutup"
        >
          <X className="size-5" />
        </button>
        <p className="font-display text-base font-bold">Keranjang</p>
        <button
          type="button"
          onClick={() => {
            if (items.length === 0) return;
            clear();
            toast("Keranjang dikosongkan");
          }}
          className="text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          Hapus semua
        </button>
      </header>

      <div className="px-4 pt-5">
        <h1 className="font-display text-2xl font-bold">Keranjang Pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalItems > 0
            ? `${totalItems} item siap dipesan`
            : "Belum ada item dipilih"}
        </p>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <span className="grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-9" />
            </span>
            <p className="mt-4 font-display text-lg font-bold">
              Keranjangmu masih kosong
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yuk pilih menu favoritmu hari ini
            </p>
            <Link
              to="/"
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Items grouped by delivery date */}
            <div className="mt-5 space-y-5">
              {dateGroupedItems.map(([deliveryDate, dateItems]) => {
                const dateTotal = dateItems.reduce(
                  (sum, l) => sum + l.qty * l.item.price,
                  0,
                );
                return (
                  <div
                    key={deliveryDate}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <h3 className="font-display text-sm font-bold">
                        {formatDateLabel(deliveryDate)}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {dateItems.map((l) => (
                        <li
                          key={`${l.id}-${deliveryDate}`}
                          className="flex gap-3 rounded-xl border border-border/50 bg-background p-2"
                        >
                          {l.item.image_url ? (
                            <img
                              src={l.item.image_url}
                              alt={l.item.name}
                              width={60}
                              height={60}
                              loading="lazy"
                              className="size-16 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="size-16 shrink-0 rounded-lg bg-muted flex items-center justify-center text-lg">
                              🍲
                            </div>
                          )}
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="line-clamp-1 font-display text-xs font-bold">
                                  {l.item.name}
                                </h4>
                                <div className="mt-1">
                                  <CategoryBadge category={l.item.category} />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(l.id, deliveryDate)}
                                className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Hapus"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-end justify-between pt-1.5 text-xs">
                              <span className="font-display font-bold text-primary">
                                {formatRupiah(l.item.price * l.qty)}
                              </span>
                              <div className="flex items-center gap-1 rounded-full border border-border bg-background/50 px-1 py-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQty(l.id, deliveryDate, l.qty - 1)
                                  }
                                  className="grid size-5 place-items-center rounded-full bg-muted hover:bg-muted-foreground/20"
                                  aria-label="Kurangi"
                                >
                                  <Minus className="size-2.5" />
                                </button>
                                <span className="w-4 text-center font-bold">
                                  {l.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQty(l.id, deliveryDate, l.qty + 1)
                                  }
                                  className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                                  aria-label="Tambah"
                                >
                                  <Plus className="size-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-border/50 pt-3 text-right">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Subtotal:{" "}
                      </span>
                      <span className="font-display text-sm font-bold text-primary">
                        {formatRupiah(dateTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment summary */}
            <section className="mt-6 rounded-2xl border border-border bg-surface p-4">
              <h2 className="font-display text-sm font-bold">
                Rincian Pembayaran
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Total Item ({totalItems})</dt>
                  <dd className="text-foreground">
                    {formatRupiah(totalPrice)}
                  </dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Biaya Pengiriman</dt>
                  <dd className="font-semibold text-success">Gratis</dd>
                </div>
                <div className="my-2 border-t border-dashed border-border" />
                <div className="flex items-center justify-between">
                  <dt className="font-display text-base font-bold">
                    Total Pembayaran
                  </dt>
                  <dd className="font-display text-xl font-bold text-primary">
                    {formatRupiah(totalPrice)}
                  </dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </div>

      {/* Sticky footer actions */}
      {items.length > 0 && (
        <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
          <div className="w-full max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
            >
              <MessageCircle className="size-5" />
              {loading ? "Memproses..." : "Konfirmasi Pesanan"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
