import Link from 'next/link';

const links = [
  ['/', 'Accueil'],
  ['/agence', 'Agence'],
  ['/vl', 'VL'],
  ['/pl', 'PL'],
  ['/imports', 'Imports'],
] as const;

export function Nav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-indigo-400 hover:text-white">
          {label}
        </Link>
      ))}
    </nav>
  );
}
