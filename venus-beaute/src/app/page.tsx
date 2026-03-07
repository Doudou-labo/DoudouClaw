import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CartBadge from "@/components/CartBadge";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 text-green-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-2xl font-black">Venus Beauté</p>
          <p className="text-sm text-green-700">Beauté naturelle · France</p>
        </div>
        <nav className="flex gap-3 text-sm font-medium">
          <Link href="/boutique" className="rounded-xl border border-green-300 px-4 py-2 hover:bg-green-100">Boutique</Link>
          <Link href="/checkout" className="rounded-xl bg-green-700 px-4 py-2 text-white hover:bg-green-800">Paiement Stripe</Link>
          <CartBadge />
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Nature & efficacité</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">La beauté au naturel, pensée pour toutes les peaux.</h1>
          <p className="mt-4 max-w-xl text-green-800/80">
            Boutique en ligne dédiée aux soins doux, ingrédients d'origine naturelle et routines simples qui marchent vraiment.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/boutique" className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">Découvrir les produits</Link>
            <Link href="/checkout" className="rounded-xl border border-green-300 px-5 py-3 font-semibold hover:bg-green-100">Commander</Link>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1400&auto=format&fit=crop"
            alt="Produits naturels"
            className="h-[420px] w-full rounded-3xl object-cover shadow-lg"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Produits mis en avant</h2>
          <Link href="/boutique" className="text-sm font-semibold text-green-700 hover:underline">Voir tout</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
