"use client";

import { useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

export default function CheckoutClient({ initialSlug, initialQty }: { initialSlug?: string; initialQty?: number }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? products[0].slug);
  const [quantity, setQuantity] = useState(Math.max(1, Math.min(20, initialQty || 1)));
  const [loading, setLoading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === selectedSlug) ?? products[0],
    [selectedSlug]
  );

  const total = useMemo(() => selectedProduct.price * quantity, [selectedProduct.price, quantity]);

  const startCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedProduct.slug, quantity }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erreur Stripe");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Impossible de démarrer le paiement Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-green-900">Paiement Stripe</h1>
        <p className="mt-3 text-green-800/80">
          Choisis ton produit et la quantité, puis valide ton paiement sécurisé.
        </p>

        <div className="mt-6 grid gap-4 rounded-2xl border border-green-100 bg-green-50 p-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-green-900">
            Produit
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="mt-2 w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm"
            >
              {products.map((product) => (
                <option key={product.id} value={product.slug}>
                  {product.name} — {formatPrice(product.price)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-green-900">
            Quantité
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="mt-2 w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-green-100 bg-white p-5">
          <div className="flex items-center justify-between text-sm text-green-900/90">
            <span>
              {selectedProduct.name} × {quantity}
            </span>
            <span className="font-medium">{formatPrice(selectedProduct.price)} / unité</span>
          </div>
          <div className="mt-3 border-t border-green-200 pt-3 flex items-center justify-between font-bold text-green-950">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          onClick={startCheckout}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirection vers Stripe..." : "Payer avec Stripe"}
        </button>
      </div>
    </main>
  );
}
