"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import CartBadge from "@/components/CartBadge";
import { formatPrice, products } from "@/data/products";

const CART_KEY = "venus_beaute_cart";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const product = useMemo(() => products.find((p) => p.slug === params.slug), [params.slug]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return notFound();

  const oldPrice = product.price + 6.1;
  const pricePer100ml = Math.round((product.price / 15) * 100);

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
    <main className="min-h-screen bg-[#f7f7f7] text-[#1f2430]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black text-[#1f2f5c]">
          Venus<span className="text-[#a89546]">Beauté</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/boutique" className="rounded-xl border border-[#d6d6d6] px-3 py-2 text-sm hover:bg-white">
            Boutique
          </Link>
          <CartBadge />
        </div>
      </header>

      <section className="bg-[#1f2b57] px-6 py-8 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-3 text-sm text-white/90">
            Accueil / Boutique en ligne / Soin visage / Yeux, lèvres & cou / {product.name}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <img src={product.image} alt={product.name} className="mx-auto h-[420px] w-full max-w-sm object-contain" />

        <h2 className="mt-8 text-5xl font-bold leading-tight text-[#8f8441]">{product.name}</h2>

        <div className="mt-4 flex items-end gap-3">
          <p className="text-3xl text-gray-500 line-through">{formatPrice(oldPrice)}</p>
          <p className="text-6xl font-black text-[#1f2430]">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-2xl text-gray-600">{pricePer100ml}€ / 100ml</p>

        <p className="mt-5 text-3xl text-[#1e7d49]">
          ✔ En stock <span className="ml-2 text-[#1f2b57]">★★★★★</span>
          <span className="ml-2 text-gray-600">(8 avis client)</span>
        </p>

        <p className="mt-6 text-5xl italic text-[#1f2430]">Gel-crème Anti-âge</p>
        <p className="mt-5 text-4xl leading-relaxed text-[#262b36]">
          Idéal pour prendre soin de l’épiderme fin du contour de l’œil et de la patte d’oie, {product.name} aide à
          régénérer l’élasticité et gomme les marques de vieillissement.
        </p>
        <p className="mt-5 text-4xl leading-relaxed text-[#262b36]">
          Jour après jour, les yeux paraissent plus jeunes et le regard s’illumine.
        </p>

        <div className="mt-8 grid grid-cols-[180px_1fr] gap-3">
          <div className="grid grid-cols-3 overflow-hidden rounded border border-gray-300 bg-white text-3xl">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="border-r border-gray-300 px-4 py-3"
            >
              -
            </button>
            <div className="flex items-center justify-center border-r border-gray-300">{quantity}</div>
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
            className="rounded-full bg-[#a89546] px-8 py-3 text-2xl font-bold uppercase tracking-wide text-white hover:opacity-95"
          >
            Ajouter au panier
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-xl bg-black py-3 text-2xl font-semibold text-white"> Pay</button>
          <button className="w-full rounded-xl bg-black py-3 text-2xl font-semibold text-white">G Pay</button>
          <button className="w-full rounded-xl bg-[#19d66d] py-3 text-2xl font-semibold text-black">Payer avec Link</button>
        </div>

        <div className="mt-7 space-y-2 text-2xl text-[#252b37]">
          <p>
            Référence : <span className="font-medium">0857232</span>
          </p>
          <p>
            Catégories : <span className="text-[#8f8441]">Produits de Soin Visage, Yeux, Lèvres & Cou</span>
          </p>
          <p>
            Principe Actif : <span className="text-[#8f8441]">Concentré de Vie Cellulaire</span>
          </p>
        </div>

        <div className="mt-8 space-y-6 text-2xl">
          {[
            "Description",
            "Informations complémentaires",
            "Marque",
            "Avis (8)",
          ].map((section) => (
            <div key={section} className="border-b border-gray-300 pb-3 text-[#8f8441]">
              {section}
            </div>
          ))}
        </div>

        <article className="mt-8 border border-gray-300 bg-white p-6 text-2xl leading-relaxed">
          <h3 className="text-4xl font-semibold text-[#8f8441]">PRESCRIPTION</h3>
          <p className="mt-4">
            • <strong>Le Concentré de Vie Cellulaire :</strong> Composé d’éléments indispensables à la vie des cellules,
            il agit de façon unique en assurant croissance, multiplication et longévité aux cellules.
          </p>

          <h3 className="mt-6 text-4xl font-semibold text-[#8f8441]">CONSEILS D’UTILISATION</h3>
          <p className="mt-3">
            Appliquer matin et soir sur le contour de l’œil parfaitement démaquillé. Effectuer de légers tapotements de
            l’extérieur vers l’intérieur.
          </p>

          <h3 className="mt-6 text-4xl font-semibold text-[#8f8441]">CONSEILS DE L’EXPERTE</h3>
          <p className="mt-3">
            Cette crème redonne confort et souplesse à la peau grâce à ses acides gras essentiels. Dès la première
            semaine la peau devient plus ferme et lumineuse, et les rides s’estompent progressivement.
          </p>
        </article>
      </section>
    </main>
  );
}
