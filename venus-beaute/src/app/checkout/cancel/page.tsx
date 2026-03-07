export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-white p-8 shadow-sm text-center">
        <p className="text-5xl">🛑</p>
        <h1 className="mt-4 text-3xl font-extrabold text-green-900">Paiement annulé</h1>
        <p className="mt-3 text-green-800/80">
          Aucun souci, ta commande n’a pas été validée. Tu peux réessayer quand tu veux.
        </p>
        <a
          href="/checkout"
          className="mt-6 inline-block rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Revenir au paiement
        </a>
      </div>
    </main>
  );
}
