import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gestion des mouvements de caisse',
  description: "Supervision des flux de trésorerie d'une agence bancaire"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
