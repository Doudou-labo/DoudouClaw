"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice, products } from "@/data/products";

type CartItem = {
  slug: string;
  quantity: number;
};

const CART_KEY = "venus_beaute_cart";
const SHIPPING = 4.9;
const FREE_SHIPPING_THRESHOLD = 60;

const clampQty = (value: number) => Math.max(1, Math.min(20, value));

export default function CheckoutClient({ initialSlug, initialQty }: { initialSlug?: string; initialQty?: number }) {
  const [cartQtyDrafts, setCartQtyDrafts] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);


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

  const subtotal = useMemo(() => cartDetailed.reduce((sum, item) => sum + item.subtotal, 0), [cartDetailed]);
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
  const total = subtotal + shipping;

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
    <main className="min-h-screen bg-green-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="fade-in-up mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">Venus Beauté</p>
          <h1 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">Récapitulatif de mon panier</h1>
          <p className="mt-2 text-sm text-green-800/80">Un panier plus clean, plus premium, mais toujours dans notre DA 🌿</p>
          <div className="mt-5 flex justify-center">
            <a
              href="/boutique"
              className="button-micro inline-flex items-center rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm hover:bg-green-50"
            >
              ← Continuer mes achats
            </a>
          </div>
        </div>

        <div className="fade-in-up-delay-1 mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-green-100 bg-white p-3 shadow-sm sm:p-4">
              {cartDetailed.length === 0 ? (
                <p className="rounded-2xl bg-green-50 px-4 py-6 text-center text-sm text-green-800/80">
                  Ton panier est vide pour l’instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {cartDetailed.map((item) => (
                    <article
                      key={item.product.slug}
                      className="card-hover grid gap-4 rounded-2xl border border-green-100 bg-white p-4 md:grid-cols-[96px_1fr_120px_120px_auto] md:items-center"
                    >
                      <div className="overflow-hidden rounded-2xl border border-green-100 bg-green-50">
                        <img src={item.product.image} alt={item.product.name} className="h-24 w-full object-cover" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-green-950">{item.product.name}</h3>
                        <p className="mt-1 text-sm text-green-800/70">{item.product.shortDescription}</p>
                        <p className="mt-2 text-sm font-semibold text-green-800">{formatPrice(item.product.price)}</p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">Quantité</p>
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
                          className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-900 outline-none transition focus:border-green-500"
                        />
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">Sous-total</p>
                        <p className="text-lg font-bold text-green-950">{formatPrice(item.subtotal)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.slug)}
                        className="button-micro rounded-xl border border-red-200 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Retirer
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="fade-in-up-delay-2 space-y-4">
            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-green-950">Résumé</h2>
              <div className="mt-5 space-y-3 text-sm text-green-900/80">
                <div className="flex items-center justify-between">
                  <span>Produits</span>
                  <span className="font-semibold text-green-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Livraison</span>
                  <span className="font-semibold text-green-950">{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-green-100 pt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-green-950">Total</span>
                <span className="text-2xl font-black text-green-950">{formatPrice(total)}</span>
              </div>

              <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
                Bon de réduction à saisir au moment du paiement sur la page sécurisée Stripe.
              </p>

              <button
                onClick={startCheckout}
                disabled={loading || cartDetailed.length === 0}
                className="button-micro mt-6 w-full rounded-2xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Redirection vers Stripe..." : "Valider ma commande"}
              </button>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-green-950">Tu as un code promo ?</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Mon bon de réduction"
                  className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm outline-none transition focus:border-green-500"
                />
                <button className="button-micro rounded-xl border border-green-200 px-4 py-3 text-sm font-medium text-green-800 hover:bg-green-50">
                  Ajouter
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
              <div className="space-y-3 text-sm text-green-900/80">
                <p>🚚 Expédié rapidement</p>
                <p>🎁 Livraison offerte dès {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
                <p>🔒 Paiement ultra sécurisé</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
