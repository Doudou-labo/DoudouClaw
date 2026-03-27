'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['/', 'Vue générale', 'Cockpit'],
  ['/agence', 'Agence', 'Pilotage global'],
  ['/vl', 'VL', 'Véhicules légers'],
  ['/pl', 'PL', 'Poids lourds'],
  ['/imports', 'Imports', 'Classeur & historique'],
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav-grid">
      {links.map(([href, label, hint]) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`nav-pill ${active ? 'is-active' : ''}`}>
            <span className="nav-pill__label">{label}</span>
            <span className="nav-pill__hint">{hint}</span>
          </Link>
        );
      })}
    </nav>
  );
}
