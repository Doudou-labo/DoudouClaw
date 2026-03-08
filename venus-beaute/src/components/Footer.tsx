import Link from "next/link";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
  { href: "/livraison-retours", label: "Livraison & retours" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-green-100 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-green-900/80 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold text-green-950">Venus Beauté</p>
          <p className="mt-1">Beauté naturelle · France</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-green-700 hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
