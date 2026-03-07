"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return notFound();

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

          <Link
            href={`/checkout?slug=${product.slug}&qty=${quantity}`}
            className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            Acheter avec Stripe
          </Link>
        </div>
      </div>
    </main>
  );
}
