import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold text-green-900">Boutique Venus Beauté</h1>
        <p className="mt-2 text-green-800/80">Livraison France · Paiement sécurisé via PayPal.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
