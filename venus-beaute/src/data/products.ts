export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  category: "Visage" | "Corps" | "Cheveux";
  badge?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "serum-eclat-aloe-vera",
    name: "Sérum Éclat Aloe Vera",
    shortDescription: "Hydrate et illumine naturellement",
    description:
      "Un sérum léger à base d'aloe vera et d'actifs d'origine naturelle pour une peau fraîche et éclatante.",
    price: 24.9,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200&auto=format&fit=crop",
    category: "Visage",
    badge: "Best-seller",
  },
  {
    id: "p2",
    slug: "creme-douceur-the-vert",
    name: "Crème Douceur Thé Vert",
    shortDescription: "Nourrit sans effet gras",
    description:
      "Crème visage au thé vert, idéale pour les routines quotidiennes et les peaux en recherche de confort.",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=1200&auto=format&fit=crop",
    category: "Visage",
  },
  {
    id: "p3",
    slug: "huile-seche-fleur-coton",
    name: "Huile Sèche Fleur de Coton",
    shortDescription: "Peau satinée et parfum délicat",
    description:
      "Huile sèche multi-usages pour le corps et les cheveux, finition douce et non collante.",
    price: 19.9,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    category: "Corps",
    badge: "Nouveau",
  },
  {
    id: "p4",
    slug: "douceur-nettoyante-fraicheur",
    name: "Douceur Nettoyante Fraîcheur",
    shortDescription: "Crème démaquillante visage, toutes peaux",
    description:
      "Crème démaquillante visage à la texture baume pour démaquiller en douceur. Adaptée à tous types de peaux, elle laisse la peau douce, fraîche, confortable et propre grâce à l'extrait d'aloe vera.",
    price: 31,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop",
    category: "Visage",
    badge: "Nouveau",
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
