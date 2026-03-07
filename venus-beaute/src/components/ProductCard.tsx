import Link from "next/link";
import { Product, formatPrice } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group card-hover overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm fade-in-up">
      <div className="overflow-hidden">
        <img src={product.image} alt={product.name} className="media-hover h-56 w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">{product.category}</span>
          {product.badge && <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">{product.badge}</span>}
        </div>
        <h3 className="text-lg font-bold text-green-900">{product.name}</h3>
        <p className="mt-1 text-sm text-green-700/80">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-green-800">{formatPrice(product.price)}</p>
          <Link href={`/produit/${product.slug}`} className="button-micro rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
            Voir
          </Link>
        </div>
      </div>
    </article>
  );
}
