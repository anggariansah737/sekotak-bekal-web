import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CDJnMFZv.js";
import { R as Route, a as useNavigate, L as Link, t as toast } from "./router-DBnI-kIc.js";
import { u as useCart, P as Plus } from "./use-cart-CsMe0mC9.js";
import { c as createLucideIcon, a as cn } from "./utils-DJdi3s0n.js";
import { H as Heart } from "./heart-4dPKQS1Y.js";
import { L as Leaf } from "./leaf-BH-LiMKl.js";
import { M as Minus } from "./minus-D_F9hwcN.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
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
const Textarea = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
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
  const [qty, setQty] = reactExports.useState(1);
  const [favorite, setFavorite] = reactExports.useState(false);
  const [note, setNote] = reactExports.useState("");
  reactExports.useEffect(() => {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Menu tidak ditemukan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-4 inline-block text-primary underline", children: "Kembali ke beranda" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square w-full overflow-hidden bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, alt: item.name, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => navigate({
          to: "/"
        }), className: "grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur", "aria-label": "Kembali", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toast("Tautan menu disalin"), className: "grid size-10 place-items-center rounded-full bg-surface/90 text-foreground shadow backdrop-blur", "aria-label": "Bagikan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: toggleFav, className: "grid size-10 place-items-center rounded-full bg-surface/90 shadow backdrop-blur", "aria-label": "Favorit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: cn("size-5", favorite ? "fill-primary stroke-primary" : "stroke-foreground") }) })
        ] })
      ] }),
      item.healthyPick && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-6 left-4 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { className: "size-3.5" }),
        " Pilihan Sehat"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mt-6 rounded-t-3xl bg-background p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: item.subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-primary", children: formatRupiah(item.price) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 fill-yellow-400 stroke-yellow-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: item.rating }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "(120+)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold", children: "Deskripsi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: item.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold", children: "Bahan Utama" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: item.ingredients.map((ing) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success", children: ing }, ing)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold", children: "Catatan Tambahan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Contoh: Pisahkan sambalnya ya, terima kasih!", className: "mt-2 min-h-[80px] rounded-xl bg-surface" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "fixed inset-x-0 bottom-0 z-30 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[480px] border-t border-border bg-surface/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-full border border-border bg-background px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQty((q) => Math.max(1, q - 1)), className: "grid size-8 place-items-center rounded-full bg-muted text-foreground", "aria-label": "Kurangi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center font-display text-base font-bold", children: qty }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQty((q) => q + 1), className: "grid size-8 place-items-center rounded-full bg-primary text-primary-foreground", "aria-label": "Tambah", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
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
