import './globals.css';
import { Nav } from '@/components/nav';

export const metadata = {
  title: 'Pilotage Dashboard',
  description: 'Dashboard de pilotage Euromaster V1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">pilotage.doudougen.xyz</h1>
              <p className="mt-2 text-sm text-slate-400">MVP V1 corrigé — scopes AGENCE / VL / PL, imports XLSX, overrides manuels.</p>
            </div>
            <Nav />
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
