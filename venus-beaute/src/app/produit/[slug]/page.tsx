"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

const CART_KEY = "venus_beaute_cart";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return notFound();

  const addToCart = () => {
    const raw = localStorage.getItem(CART_KEY);
    let cart: { slug: string; quantity: number }[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          cart = parsed;
        }
      } catch {
        cart = [];
      }
    }

    const existing = cart.find((item) => item.slug === product.slug);
    if (existing) {
      existing.quantity = Math.max(1, Math.min(20, existing.quantity + quantity));
    } else {
      cart.push({ slug: product.slug, quantity });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        <img src={product.image} alt={product.name} className="h-[450px] w-full rounded-3xl object-cover" />
        <div>
          <p className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{product.category}</p>
          <h1 className="text-4xl font-extrabold text-green-900">{product.name}</h1>
          <p className="mt-4 text-green-800/90">{product.description}</p>
          <p className="mt-6 text-3xl font-bold text-green-700">{formatPrice(product.price)}</p>

          <label className="mt-6 block text-sm font-semibold text-green-900">
            Quantité
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="mt-2 w-28 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm"
            />
          </label>

          <button
            onClick={addToCart}
            className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </main>
  );
}
