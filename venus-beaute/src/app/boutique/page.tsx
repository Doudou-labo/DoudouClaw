import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CartBadge from "@/components/CartBadge";
import { products } from "@/data/products";

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-green-900">Boutique Venus Beauté</h1>
            <p className="mt-2 text-green-800/80">Livraison France · Paiement sécurisé via Stripe.</p>
          </div>
          <div className="flex gap-3 text-sm font-medium">
            <Link href="/" className="rounded-xl border border-green-300 px-4 py-2 hover:bg-green-100">
              Accueil
            </Link>
            <CartBadge />
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
