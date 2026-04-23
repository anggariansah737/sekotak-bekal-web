import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Truck,
  Package,
  Calendar,
} from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";

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

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Pesanan — Sekotak Bekal" }] }),
});

const statusConfig = {
  menunggu_pembayaran: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  dikonfirmasi: {
    label: "Dikonfirmasi",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  dikirim: {
    label: "Dalam Pengiriman",
    color: "bg-orange-100 text-orange-700",
    icon: Truck,
  },
  selesai: {
    label: "Selesai",
    color: "bg-green-100 text-green-700",
    icon: Package,
  },
};

function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen pb-28">
        <header className="border-b border-border bg-background px-4 py-4">
          <h1 className="font-display text-xl font-bold">Pesanan Saya</h1>
        </header>
        <div className="flex flex-col items-center px-4 py-20 text-center">
          <p className="font-display text-lg font-bold">
            Silakan masuk terlebih dahulu
          </p>
          <Link
            to="/auth"
            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="border-b border-border bg-background px-4 py-4">
        <h1 className="font-display text-xl font-bold">Pesanan Saya</h1>
        <p className="text-xs text-muted-foreground">
          Riwayat dan status pesananmu
        </p>
      </header>

      {loading ? (
        <div className="space-y-3 px-4 pt-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-muted animate-pulse"
              />
            ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-20 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-9" />
          </span>
          <p className="mt-4 font-display text-lg font-bold">
            Belum ada pesanan
          </p>
          <p className="mt-1 max-w-[260px] text-sm text-muted-foreground">
            Pesanan kamu akan muncul di sini setelah checkout pertama.
          </p>
          <Link
            to="/"
            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Mulai Pesan
          </Link>
        </div>
      ) : (
        <div className="space-y-3 px-4 pt-4">
          {orders.map((order) => {
            const config =
              statusConfig[order.status as keyof typeof statusConfig] ||
              statusConfig.menunggu_pembayaran;
            const StatusIcon = config.icon;
            return (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm">
                      Pesanan #{order.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dibuat{" "}
                      {new Date(order.created_at || "").toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                    {order.delivery_date && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                        <Calendar className="size-3" />
                        <span>
                          Pengiriman{" "}
                          {(() => {
                            const [year, month, day] = order.delivery_date
                              .split("-")
                              .map(Number);
                            const d = new Date(year, month - 1, day);
                            return `${DAY_NAMES[d.getDay()]}, ${day} ${MONTH_NAMES[d.getMonth()]}`;
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-full p-2 ${config.color}`}>
                    <StatusIcon className="size-4" />
                  </div>
                </div>
                <div
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3 ${config.color}`}
                >
                  {config.label}
                </div>
                <div className="text-sm space-y-1 mb-3">
                  {order.items?.slice(0, 2).map((item) => (
                    <p key={item.id} className="text-muted-foreground">
                      {item.quantity}× {item.menu_items?.name || "Menu"}
                    </p>
                  ))}
                  {order.items && order.items.length > 2 && (
                    <p className="text-muted-foreground text-xs">
                      +{order.items.length - 2} item lainnya
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display font-bold text-primary">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
