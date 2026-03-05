import './globals.css';

export const metadata = {
  title: 'Second Brain — Doudou',
  description: 'Search notes, conversations, and memories',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
