import './globals.css';
import { Nav } from '@/components/nav';

export const metadata = {
  title: 'Pilotage Dashboard',
  description: 'Cockpit de pilotage Euromaster',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main className="shell">
          <header className="topbar">
            <div>
              <p className="eyebrow">Tableau de pilotage opérationnel</p>
              <h1>pilotage.doudougen.xyz</h1>
              <p className="topbar__subtitle">
                Vue bureau dense, pensée comme un cockpit agence : périodes, scopes, KPI, écarts et statuts en lecture immédiate.
              </p>
            </div>
            <div className="topbar__aside">
              <div className="status-chip">Source active : dernier import + overrides</div>
              <div className="status-chip">Mode : suivi mensuel AGENCE / VL / PL</div>
            </div>
          </header>

          <Nav />
          <section className="page-frame">{children}</section>
        </main>
      </body>
    </html>
  );
}
