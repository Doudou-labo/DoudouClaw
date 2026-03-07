"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

type CartItem = {
  slug: string;
  quantity: number;
};

const CART_KEY = "venus_beaute_cart";

const clampQty = (value: number) => Math.max(1, Math.min(20, value));

export default function CheckoutClient({ initialSlug, initialQty }: { initialSlug?: string; initialQty?: number }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? products[0].slug);
  const [quantityInput, setQuantityInput] = useState(String(clampQty(initialQty || 1)));
  const [cartQtyDrafts, setCartQtyDrafts] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === selectedSlug) ?? products[0],
    [selectedSlug]
  );

  const selectedQuantity = clampQty(Number(quantityInput || 1));

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        if (!product) return null;
        return { product, quantity: item.quantity, subtotal: product.price * item.quantity };
      })
      .filter(
        (item): item is { product: (typeof products)[number]; quantity: number; subtotal: number } => item !== null
      );
  }, [cart]);

  const total = useMemo(() => cartDetailed.reduce((sum, item) => sum + item.subtotal, 0), [cartDetailed]);

  const persistCart = (nextCart: CartItem[]) => {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("venus_cart_updated"));
  };

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    let parsed: CartItem[] = [];

    if (raw) {
      try {
        const data = JSON.parse(raw) as CartItem[];
        if (Array.isArray(data)) {
          parsed = data
            .map((item) => ({
              slug: String(item.slug),
              quantity: clampQty(Number(item.quantity || 1)),
            }))
            .filter((item) => products.some((p) => p.slug === item.slug));
        }
      } catch {
        parsed = [];
      }
    }

    if (initialSlug) {
      const safeQty = clampQty(Number(initialQty || 1));
      const existing = parsed.find((item) => item.slug === initialSlug);
      if (existing) {
        existing.quantity = clampQty(existing.quantity + safeQty);
      } else {
        parsed.push({ slug: initialSlug, quantity: safeQty });
      }
    }

    persistCart(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSelectedToCart = () => {
    const existing = cart.find((item) => item.slug === selectedProduct.slug);
    if (existing) {
      persistCart(
        cart.map((item) =>
          item.slug === selectedProduct.slug ? { ...item, quantity: clampQty(item.quantity + selectedQuantity) } : item
        )
      );
    } else {
      persistCart([...cart, { slug: selectedProduct.slug, quantity: selectedQuantity }]);
    }
    setQuantityInput("1");
  };

  const updateQty = (slug: string, nextQty: number) => {
    persistCart(cart.map((item) => (item.slug === slug ? { ...item, quantity: clampQty(nextQty) } : item)));
  };

  const removeItem = (slug: string) => {
    const next = cart.filter((item) => item.slug !== slug);
    setCartQtyDrafts((drafts) => {
      const clone = { ...drafts };
      delete clone[slug];
      return clone;
    });
    persistCart(next);
  };

  const startCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
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
      <div className="mx-auto max-w-4xl rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-green-900">Panier & paiement Stripe</h1>
        <p className="mt-3 text-green-800/80">Ajoute des articles, ajuste les quantités, puis valide ton paiement sécurisé.</p>

        <div className="mt-6 grid gap-4 rounded-2xl border border-green-100 bg-green-50 p-5 md:grid-cols-[1fr_auto_auto] md:items-end">
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
              type="text"
              inputMode="numeric"
              value={quantityInput}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "");
                if (cleaned === "") {
                  setQuantityInput("");
                  return;
                }
                setQuantityInput(String(clampQty(Number(cleaned))));
              }}
              onBlur={() => setQuantityInput(String(clampQty(Number(quantityInput || 1))))}
              className="mt-2 w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm"
            />
          </label>

          <button
            onClick={addSelectedToCart}
            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Ajouter au panier
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5">
          <p className="font-semibold text-green-900">Ton panier</p>

          {cartDetailed.length === 0 ? (
            <p className="mt-3 text-sm text-green-800/80">Ton panier est vide pour l’instant.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {cartDetailed.map((item) => (
                <div
                  key={item.product.slug}
                  className="grid gap-3 rounded-xl border border-green-100 bg-green-50 p-3 md:grid-cols-[1fr_120px_120px_auto] md:items-center"
                >
                  <div>
                    <p className="font-medium text-green-900">{item.product.name}</p>
                    <p className="text-sm text-green-800/80">{formatPrice(item.product.price)} / unité</p>
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={cartQtyDrafts[item.product.slug] ?? String(item.quantity)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setCartQtyDrafts((drafts) => ({ ...drafts, [item.product.slug]: cleaned }));
                    }}
                    onBlur={() => {
                      const draft = cartQtyDrafts[item.product.slug];
                      const normalized = clampQty(Number(draft || item.quantity || 1));
                      updateQty(item.product.slug, normalized);
                      setCartQtyDrafts((drafts) => ({ ...drafts, [item.product.slug]: String(normalized) }));
                    }}
                    className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm"
                  />

                  <p className="font-semibold text-green-900">{formatPrice(item.subtotal)}</p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.slug)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-green-200 pt-3 flex items-center justify-between font-bold text-green-950">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          onClick={startCheckout}
          disabled={loading || cartDetailed.length === 0}
          className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirection vers Stripe..." : "Payer avec Stripe"}
        </button>
      </div>
    </main>
  );
}
