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
        if (Array.isArray(parsed)) cart = parsed;
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
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 fade-in-up">
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

      <section className="bg-green-800 px-4 py-8 text-white sm:px-6 fade-in-up-delay-1">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-green-100">{category}</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-sm text-white/90">Accueil / Boutique en ligne / {category} / {product.name}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:gap-10 md:py-12">
        <div className="group card-hover rounded-3xl border border-green-100 bg-white p-4 shadow-sm sm:p-6 fade-in-up-delay-2">
          <div className="overflow-hidden rounded-2xl">
            <img src={product.image} alt={product.name} className="media-hover h-[360px] w-full object-cover sm:h-[430px]" />
          </div>
        </div>

        <div className="card-hover rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-7 fade-in-up-delay-3">
          <h2 className="text-3xl font-extrabold leading-tight text-green-900 sm:text-4xl">{product.name}</h2>

          <div className="mt-4 flex items-end gap-3">
            <p className="text-xl text-green-900/40 line-through sm:text-2xl">{formatPrice(oldPrice)}</p>
            <p className="text-4xl font-black text-[#8f8441] sm:text-5xl">{formatPrice(product.price)}</p>
          </div>

          <p className="mt-2 text-sm text-green-700">✔ En stock · Livraison France</p>

          <p className="mt-5 text-base leading-relaxed text-green-900/90 sm:text-lg">{product.description}</p>

          <div className="mt-6 grid grid-cols-[120px_1fr] gap-3 sm:grid-cols-[150px_1fr]">
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-green-300 bg-white text-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="button-micro border-r border-green-300 px-3 py-2 font-semibold"
              >
                −
              </button>
              <div className="flex items-center justify-center border-r border-green-300 font-semibold">{quantity}</div>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="button-micro px-3 py-2 font-semibold"
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              className="button-micro rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-800 sm:text-base"
            >
              Ajouter au panier
            </button>
          </div>

          <div className="mt-5 grid gap-2 text-sm text-green-900/80">
            <p>• Paiement sécurisé Stripe</p>
            <p>• Retours simplifiés</p>
            <p>• Service client réactif</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 md:pb-14 fade-in-up-delay-3">
        <div className="card-hover rounded-3xl border border-green-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-2xl font-semibold text-[#8f8441]">Description</h3>
          <p className="mt-3 text-base leading-relaxed text-green-900/90 sm:text-lg">{product.description}</p>
          <p className="mt-3 text-base leading-relaxed text-green-900/90 sm:text-lg">
            Convient parfaitement à une routine quotidienne. Formule douce, texture agréable et résultats visibles avec
            une application régulière.
          </p>
        </div>
      </section>
    </main>
  );
}
