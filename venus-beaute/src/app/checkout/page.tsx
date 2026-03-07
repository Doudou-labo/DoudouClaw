"use client";

import { useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const total = useMemo(() => products.reduce((sum, p) => sum + p.price, 0), []);

  const startCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
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
          Checkout sécurisé activé. Pour ce MVP, le panier inclut les produits de démonstration (1 unité de chaque).
        </p>

        <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
          <p className="font-semibold text-green-900">Récapitulatif</p>
          <ul className="mt-3 space-y-2 text-sm text-green-900/90">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-4">
                <span>{product.name}</span>
                <span className="font-medium">{formatPrice(product.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-green-200 pt-3 flex items-center justify-between font-bold text-green-950">
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
