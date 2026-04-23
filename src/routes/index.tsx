import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Plus, Sparkles } from "lucide-react";
import { useMenuByDate } from "@/hooks/use-menu";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { CategoryBadge } from "@/components/CategoryBadge";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import logo from "@/assets/logo.svg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

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

function HomePage() {
  const { totalItems, add } = useCart();
  const today = useMemo(() => new Date(), []);
  const [activeIdx, setActiveIdx] = useState(0);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, [today]);

  const selectedDate = days[activeIdx].toISOString().split("T")[0];
  const { items, loading, error } = useMenuByDate(selectedDate);

  const monthLabel = `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;
  const selectedDateLabel = `${DAY_NAMES[days[activeIdx].getDay()]}, ${days[activeIdx].getDate()} ${MONTH_NAMES[days[activeIdx].getMonth()]}`;

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-primary p-1">
              <img
                src={logo}
                alt="Sekotak Bekal"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold">Sekotak Bekal</p>
              <p className="text-[11px] text-muted-foreground">
                Catering makan setiap hari
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toast("Fitur pencarian segera hadir")}
              className="grid size-10 place-items-center rounded-full text-foreground hover:bg-muted"
              aria-label="Cari menu"
            >
              <Search className="size-5" />
            </button>
            <Link
              to="/cart"
              className="relative grid size-10 place-items-center rounded-full text-foreground hover:bg-muted"
              aria-label="Keranjang"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Date selector */}
      <section className="px-4 pt-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Pilih Tanggal</h2>
            <p className="text-xs text-muted-foreground">
              Pesan untuk hari yang kamu mau
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {monthLabel}
          </span>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {days.map((d, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "flex min-w-[58px] flex-col items-center rounded-2xl border px-3 py-3 transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "border-border bg-surface text-foreground hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    active ? "opacity-90" : "text-muted-foreground",
                  )}
                >
                  {DAY_NAMES[d.getDay()]}
                </span>
                <span className="mt-1 font-display text-xl font-bold">
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu hari ini */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {selectedDateLabel}
          </h2>
          {items.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Tersedia
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-muted animate-pulse"
                />
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Gagal memuat menu</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Menu belum tersedia untuk hari ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((m) => (
              <article
                key={m.id}
                className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link to="/menu/$id" params={{ id: m.id }} className="block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {m.image_url ? (
                      <img
                        src={m.image_url}
                        alt={m.name}
                        width={400}
                        height={400}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">
                        🍲
                      </div>
                    )}
                    <div className="absolute left-2 top-2">
                      <CategoryBadge category={m.category} />
                    </div>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to="/menu/$id" params={{ id: m.id }}>
                    <h3 className="line-clamp-1 font-display text-sm font-bold">
                      {m.name}
                    </h3>
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    {m.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-primary">
                      {formatRupiah(m.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        add(m.id, selectedDate, 1);
                        toast.success(
                          `${m.name} ditambahkan untuk ${selectedDateLabel}`,
                        );
                      }}
                      className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform active:scale-90"
                      aria-label={`Tambah ${m.name}`}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Promo banner */}
      <section className="px-4 pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft to-accent p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-sm font-bold text-foreground">
                Langganan Mingguan!
              </h3>
              <p className="mt-0.5 text-xs text-foreground/70">
                Diskon 15% untuk paket 5 hari kerja. Praktis & hemat.
              </p>
            </div>
            <Link
              to="/auth"
              className="self-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Coba
            </Link>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
