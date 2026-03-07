import CheckoutClient from "@/components/CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; qty?: string }>;
}) {
  const params = await searchParams;
  const qty = Number(params.qty ?? "1");

  return <CheckoutClient initialSlug={params.slug} initialQty={qty} />;
}
