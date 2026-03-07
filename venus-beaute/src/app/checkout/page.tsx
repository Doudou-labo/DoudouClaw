export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-green-900">Paiement PayPal</h1>
        <p className="mt-3 text-green-800/80">
          Le module PayPal est prêt à être connecté avec ton compte marchand. Dès que tu me donnes les produits + photos,
          je câble le vrai panier + total + bouton PayPal final.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-green-300 bg-green-50 p-5">
          <p className="font-semibold text-green-800">Étapes restantes (rapides) :</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-green-800/90">
            <li>Importer ta liste produits et visuels</li>
            <li>Configurer PayPal Client ID (sandbox puis production)</li>
            <li>Activer emails de commande + CGV/mentions légales</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
