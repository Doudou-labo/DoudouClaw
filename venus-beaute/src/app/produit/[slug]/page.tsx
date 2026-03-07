import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, products } from "@/data/products";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
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
          <Link href="/checkout" className="mt-6 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">
            Acheter via PayPal
          </Link>
        </div>
      </div>
    </main>
  );
}
