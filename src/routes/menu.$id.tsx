import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Leaf,
} from "lucide-react";
import { getMenuById, formatRupiah } from "@/data/menu";
import { useCart } from "@/hooks/use-cart";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/menu/$id")({
  component: MenuDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-xl font-bold">Menu tidak ditemukan</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-xl font-bold">Terjadi kesalahan</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  },
});

function MenuDetailPage() {
  const { id } = Route.useParams();
  const item = getMenuById(id);
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const favs = JSON.parse(
      window.localStorage.getItem("sekotal-favs") || "[]",
    ) as string[];
    setFavorite(favs.includes(id));
  }, [id]);

  const toggleFav = () => {
    const favs = JSON.parse(
      window.localStorage.getItem("sekotal-favs") || "[]",
    ) as string[];
    const next = favs.includes(id)
      ? favs.filter((x) => x !== id)
      : [...favs, id];
    window.localStorage.setItem("sekotal-favs", JSON.stringify(next));
    setFavorite(!favorite);
    toast(favorite ? "Dihapus dari favorit" : "Ditambahkan ke favorit");
  };

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-xl font-bold">
            Menu tidak ditemukan
          </h1>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* Image hero */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        {/* Floating header */}
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur"
            aria-label="Kembali"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toast("Tautan menu disalin")}
              className="grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur"
              aria-label="Bagikan"
            >
              <Share2 className="size-5" />
            </button>
            <button
              type="button"
              onClick={toggleFav}
              className="grid size-10 place-items-center rounded-full bg-surface/90 shadow backdrop-blur"
              aria-label="Favorit"
            >
              <Heart
                className={cn(
                  "size-5",
                  favorite
                    ? "fill-primary stroke-primary"
                    : "stroke-foreground",
                )}
              />
            </button>
          </div>
        </header>

        {item.healthyPick && (
          <span className="absolute bottom-6 left-4 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground shadow-lg">
            <Leaf className="size-3.5" /> Pilihan Sehat
          </span>
        )}
      </div>

      {/* Content card */}
      <div className="-mt-6 rounded-t-3xl bg-background p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold">{item.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.subtitle}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-primary">
              {formatRupiah(item.price)}
            </p>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-yellow-400 stroke-yellow-400" />
              <span className="font-semibold text-foreground">
                {item.rating}
              </span>
              <span>(120+)</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mt-5">
          <h2 className="font-display text-base font-bold">Deskripsi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </section>

        {/* Ingredients */}
        <section className="mt-5">
          <h2 className="font-display text-base font-bold">Bahan Utama</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success"
              >
                {ing}
              </span>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="mt-5">
          <h2 className="font-display text-base font-bold">Catatan Tambahan</h2>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Pisahkan sambalnya ya, terima kasih!"
            className="mt-2 min-h-[80px] rounded-xl bg-surface"
          />
        </section>
      </div>

      {/* Sticky footer */}
      <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
        <div className="w-full max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-8 place-items-center rounded-full bg-muted text-foreground"
                aria-label="Kurangi"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-5 text-center font-display text-base font-bold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
                aria-label="Tambah"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                add(item.id, qty);
                toast.success(`${qty}× ${item.name} ditambahkan`);
                navigate({ to: "/" });
              }}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-95"
            >
              Tambah ke Pesanan
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
