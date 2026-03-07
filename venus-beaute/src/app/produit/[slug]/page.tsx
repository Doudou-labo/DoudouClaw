"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import CartBadge from "@/components/CartBadge";
import { formatPrice, products } from "@/data/products";

const CART_KEY = "venus_beaute_cart";

const categoryLabel: Record<string, string> = {
  Visage: "Soin visage",
  Corps: "Soin corps",
  Cheveux: "Soin cheveux",
};

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return notFound();

  const oldPrice = product.price + 6.1;
  const category = categoryLabel[product.category] ?? product.category;

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
    window.dispatchEvent(new Event("venus_cart_updated"));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-green-50 text-green-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black text-green-900">
          Venus<span className="text-[#a89546]">Beauté</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/boutique" className="rounded-xl border border-green-300 px-3 py-2 text-sm hover:bg-green-100">
            Boutique
          </Link>
          <CartBadge />
        </div>
      </header>

      <section className="bg-green-800 px-6 py-8 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-3 text-sm text-white/90">
            Accueil / Boutique en ligne / {category} / {product.name}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <img src={product.image} alt={product.name} className="mx-auto h-[420px] w-full max-w-sm rounded-2xl object-cover" />

        <h2 className="mt-8 text-5xl font-bold leading-tight text-[#8f8441]">{product.name}</h2>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-3xl text-green-900/40 line-through">{formatPrice(oldPrice)}</p>
          <p className="text-6xl font-black text-green-900">{formatPrice(product.price)}</p>
        </div>

        <p className="mt-4 text-2xl text-green-700">✔ En stock</p>

        <p className="mt-6 text-2xl leading-relaxed text-green-900/90">{product.description}</p>

        <div className="mt-8 grid grid-cols-[180px_1fr] gap-3">
          <div className="grid grid-cols-3 overflow-hidden rounded border border-green-300 bg-white text-2xl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="border-r border-green-300 px-4 py-3"
            >
              -
            </button>
            <div className="flex items-center justify-center border-r border-green-300">{quantity}</div>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="px-4 py-3"
            >
              +
            </button>
          </div>

          <button
            onClick={addToCart}
            className="rounded-full bg-green-700 px-8 py-3 text-xl font-bold uppercase tracking-wide text-white hover:bg-green-800"
          >
            Ajouter au panier
          </button>
        </div>

        <div className="mt-8 border border-green-200 bg-white p-6 text-lg leading-relaxed text-green-900/90">
          <h3 className="text-2xl font-semibold text-[#8f8441]">Description</h3>
          <p className="mt-3">{product.description}</p>
          <p className="mt-3">
            Convient parfaitement à une routine quotidienne. Formule douce, texture agréable et résultats visibles avec
            une application régulière.
          </p>
        </div>
      </section>
    </main>
  );
}
