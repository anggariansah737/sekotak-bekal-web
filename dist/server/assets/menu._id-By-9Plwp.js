import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Heart, Leaf, Star, Minus, Plus } from "lucide-react";
import { u as useCart } from "./use-cart-CXnovB_z.js";
import { c as cn } from "./utils-FX9JXj3v.js";
import { toast } from "sonner";
import { R as Route } from "./router-VI3ubcTf.js";
import "clsx";
import "tailwind-merge";
import "@supabase/supabase-js";
const ayamBakar = "/assets/ayam-bakar-madu-BhChHWeB.jpg";
const bento = "/assets/bento-anak-DkWUSRBh.jpg";
const balado = "/assets/nasi-balado-88avU1Xh.jpg";
const jimbaran = "/assets/ikan-jimbaran-DDuHy0TK.jpg";
const campur = "/assets/nasi-campur-CEeDFBX3.jpg";
const salad = "/assets/salad-segar-dQZpq_L3.jpg";
const menu = [
  {
    id: "ayam-bakar-madu",
    name: "Ayam Bakar Madu",
    subtitle: "Nasi + sayur segar",
    price: 28e3,
    image: ayamBakar,
    category: "POPULER",
    rating: 4.8,
    healthyPick: true,
    description: "Ayam pilihan yang dibakar perlahan dengan bumbu madu khas Sekotak Bekal. Disajikan hangat dengan nasi pulen, sayur tumis segar, dan irisan jeruk nipis untuk kesegaran ekstra. Rendah minyak, kaya protein.",
    ingredients: [
      "Ayam kampung",
      "Madu murni",
      "Bumbu rempah",
      "Jeruk nipis",
      "Sayur segar"
    ]
  },
  {
    id: "bento-anak",
    name: "Bento Anak Ceria",
    subtitle: "Lucu & bergizi",
    price: 22e3,
    image: bento,
    category: "ANAK",
    rating: 4.9,
    description: "Bento spesial untuk si kecil dengan nasi berbentuk lucu, sosis ayam tanpa pengawet, brokoli, wortel, dan telur rebus. Porsi pas dan gizi seimbang untuk bekal sekolah.",
    ingredients: ["Nasi", "Sosis ayam", "Brokoli", "Wortel", "Telur"]
  },
  {
    id: "nasi-daging-balado",
    name: "Nasi Daging Balado",
    subtitle: "Pedas berbumbu",
    price: 32e3,
    image: balado,
    category: "PEDAS",
    rating: 4.7,
    description: "Daging sapi empuk dimasak dengan bumbu balado khas Padang. Ditemani nasi hangat, kering tempe, dan irisan timun penyegar. Cocok untuk yang doyan pedas.",
    ingredients: [
      "Daging sapi",
      "Cabai merah",
      "Tempe",
      "Bumbu balado",
      "Timun"
    ]
  },
  {
    id: "ikan-jimbaran",
    name: "Ikan Bakar Jimbaran",
    subtitle: "Sambal matah",
    price: 35e3,
    image: jimbaran,
    category: "NUTRISI+",
    rating: 4.8,
    healthyPick: true,
    description: "Ikan segar dibakar dengan bumbu khas Jimbaran Bali, disajikan di atas daun pisang dengan sambal matah, nasi putih, dan jeruk limau. Kaya omega-3 dan rendah lemak.",
    ingredients: [
      "Ikan kakap",
      "Sambal matah",
      "Daun pisang",
      "Jeruk limau",
      "Nasi putih"
    ]
  },
  {
    id: "nasi-campur-spesial",
    name: "Nasi Campur Spesial",
    subtitle: "Lengkap & gurih",
    price: 3e4,
    image: campur,
    category: "POPULER",
    rating: 4.6,
    description: "Nasi campur lengkap dengan ayam suwir, telur ceplok, kacang, sayur, dan sambal khas. Satu mangkuk yang bikin kenyang dan puas. Cocok untuk makan siang.",
    ingredients: ["Ayam suwir", "Telur", "Kacang tanah", "Sayur", "Sambal"]
  },
  {
    id: "salad-segar",
    name: "Salad Quinoa Segar",
    subtitle: "Plant-based bowl",
    price: 26e3,
    image: salad,
    category: "VEGAN",
    rating: 4.7,
    healthyPick: true,
    description: "Mangkuk segar berisi quinoa, alpukat, tomat ceri, selada, dan zaitun hitam. Disiram dressing lemon ringan. Ideal untuk diet sehat dan vegan.",
    ingredients: ["Quinoa", "Alpukat", "Tomat ceri", "Selada", "Zaitun"]
  }
];
const getMenuById = (id) => menu.find((m) => m.id === id);
const formatRupiah = (n) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(n);
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
function MenuDetailPage() {
  const {
    id
  } = Route.useParams();
  const item = getMenuById(id);
  const navigate = useNavigate();
  const {
    add
  } = useCart();
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const favs = JSON.parse(window.localStorage.getItem("sekotal-favs") || "[]");
    setFavorite(favs.includes(id));
  }, [id]);
  const toggleFav = () => {
    const favs = JSON.parse(window.localStorage.getItem("sekotal-favs") || "[]");
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    window.localStorage.setItem("sekotal-favs", JSON.stringify(next));
    setFavorite(!favorite);
    toast(favorite ? "Dihapus dari favorit" : "Ditambahkan ke favorit");
  };
  if (!item) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center px-4 text-center", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-xl font-bold", children: "Menu tidak ditemukan" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-block text-primary underline", children: "Kembali ke beranda" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pb-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxs("header", { className: "absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
          to: "/"
        }), className: "grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur", "aria-label": "Kembali", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toast("Tautan menu disalin"), className: "grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur", "aria-label": "Bagikan", children: /* @__PURE__ */ jsx(Share2, { className: "size-5" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: toggleFav, className: "grid size-10 place-items-center rounded-full bg-surface/90 shadow backdrop-blur", "aria-label": "Favorit", children: /* @__PURE__ */ jsx(Heart, { className: cn("size-5", favorite ? "fill-primary stroke-primary" : "stroke-foreground") }) })
        ] })
      ] }),
      item.healthyPick && /* @__PURE__ */ jsxs("span", { className: "absolute bottom-6 left-4 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground shadow-lg", children: [
        /* @__PURE__ */ jsx(Leaf, { className: "size-3.5" }),
        " Pilihan Sehat"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "-mt-6 rounded-t-3xl bg-background p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-bold", children: item.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: item.subtitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-2xl font-bold text-primary", children: formatRupiah(item.price) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Star, { className: "size-3.5 fill-yellow-400 stroke-yellow-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: item.rating }),
            /* @__PURE__ */ jsx("span", { children: "(120+)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-bold", children: "Deskripsi" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: item.description })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-bold", children: "Bahan Utama" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: item.ingredients.map((ing) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success", children: ing }, ing)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-bold", children: "Catatan Tambahan" }),
        /* @__PURE__ */ jsx(Textarea, { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Contoh: Pisahkan sambalnya ya, terima kasih!", className: "mt-2 min-h-[80px] rounded-xl bg-surface" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "fixed inset-x-0 bottom-0 z-30 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setQty((q) => Math.max(1, q - 1)), className: "grid size-8 place-items-center rounded-full bg-muted text-foreground", "aria-label": "Kurangi", children: /* @__PURE__ */ jsx(Minus, { className: "size-4" }) }),
        /* @__PURE__ */ jsx("span", { className: "w-5 text-center font-display text-base font-bold", children: qty }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setQty((q) => q + 1), className: "grid size-8 place-items-center rounded-full bg-primary text-primary-foreground", "aria-label": "Tambah", children: /* @__PURE__ */ jsx(Plus, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        add(item.id, qty);
        toast.success(`${qty}× ${item.name} ditambahkan`);
        navigate({
          to: "/"
        });
      }, className: "flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 active:scale-95", children: "Tambah ke Pesanan" })
    ] }) }) })
  ] });
}
export {
  MenuDetailPage as component
};
