import ayamBakar from "@/assets/ayam-bakar-madu.jpg";
import bento from "@/assets/bento-anak.jpg";
import balado from "@/assets/nasi-balado.jpg";
import jimbaran from "@/assets/ikan-jimbaran.jpg";
import campur from "@/assets/nasi-campur.jpg";
import salad from "@/assets/salad-segar.jpg";

export type MenuCategory = "POPULER" | "VEGAN" | "NUTRISI+" | "ANAK" | "PEDAS";

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  category: MenuCategory;
  description: string;
  ingredients: string[];
  rating: number;
  healthyPick?: boolean;
}

export const menu: MenuItem[] = [
  {
    id: "ayam-bakar-madu",
    name: "Ayam Bakar Madu",
    subtitle: "Nasi + sayur segar",
    price: 28000,
    image: ayamBakar,
    category: "POPULER",
    rating: 4.8,
    healthyPick: true,
    description:
      "Ayam pilihan yang dibakar perlahan dengan bumbu madu khas Sekotak Bekal. Disajikan hangat dengan nasi pulen, sayur tumis segar, dan irisan jeruk nipis untuk kesegaran ekstra. Rendah minyak, kaya protein.",
    ingredients: [
      "Ayam kampung",
      "Madu murni",
      "Bumbu rempah",
      "Jeruk nipis",
      "Sayur segar",
    ],
  },
  {
    id: "bento-anak",
    name: "Bento Anak Ceria",
    subtitle: "Lucu & bergizi",
    price: 22000,
    image: bento,
    category: "ANAK",
    rating: 4.9,
    description:
      "Bento spesial untuk si kecil dengan nasi berbentuk lucu, sosis ayam tanpa pengawet, brokoli, wortel, dan telur rebus. Porsi pas dan gizi seimbang untuk bekal sekolah.",
    ingredients: ["Nasi", "Sosis ayam", "Brokoli", "Wortel", "Telur"],
  },
  {
    id: "nasi-daging-balado",
    name: "Nasi Daging Balado",
    subtitle: "Pedas berbumbu",
    price: 32000,
    image: balado,
    category: "PEDAS",
    rating: 4.7,
    description:
      "Daging sapi empuk dimasak dengan bumbu balado khas Padang. Ditemani nasi hangat, kering tempe, dan irisan timun penyegar. Cocok untuk yang doyan pedas.",
    ingredients: [
      "Daging sapi",
      "Cabai merah",
      "Tempe",
      "Bumbu balado",
      "Timun",
    ],
  },
  {
    id: "ikan-jimbaran",
    name: "Ikan Bakar Jimbaran",
    subtitle: "Sambal matah",
    price: 35000,
    image: jimbaran,
    category: "NUTRISI+",
    rating: 4.8,
    healthyPick: true,
    description:
      "Ikan segar dibakar dengan bumbu khas Jimbaran Bali, disajikan di atas daun pisang dengan sambal matah, nasi putih, dan jeruk limau. Kaya omega-3 dan rendah lemak.",
    ingredients: [
      "Ikan kakap",
      "Sambal matah",
      "Daun pisang",
      "Jeruk limau",
      "Nasi putih",
    ],
  },
  {
    id: "nasi-campur-spesial",
    name: "Nasi Campur Spesial",
    subtitle: "Lengkap & gurih",
    price: 30000,
    image: campur,
    category: "POPULER",
    rating: 4.6,
    description:
      "Nasi campur lengkap dengan ayam suwir, telur ceplok, kacang, sayur, dan sambal khas. Satu mangkuk yang bikin kenyang dan puas. Cocok untuk makan siang.",
    ingredients: ["Ayam suwir", "Telur", "Kacang tanah", "Sayur", "Sambal"],
  },
  {
    id: "salad-segar",
    name: "Salad Quinoa Segar",
    subtitle: "Plant-based bowl",
    price: 26000,
    image: salad,
    category: "VEGAN",
    rating: 4.7,
    healthyPick: true,
    description:
      "Mangkuk segar berisi quinoa, alpukat, tomat ceri, selada, dan zaitun hitam. Disiram dressing lemon ringan. Ideal untuk diet sehat dan vegan.",
    ingredients: ["Quinoa", "Alpukat", "Tomat ceri", "Selada", "Zaitun"],
  },
];

export const getMenuById = (id: string) => menu.find((m) => m.id === id);

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
