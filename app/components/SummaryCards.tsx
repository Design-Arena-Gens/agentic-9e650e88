'use client';

import { CashSummary } from '@/lib/types';
import styles from './SummaryCards.module.css';

interface Props {
  summary?: CashSummary;
  seuil: number;
}

const locationKeys = ['coffre', 'guichet', 'dab'] as const;

const labels: Record<(typeof locationKeys)[number], string> = {
  coffre: 'Coffre agence',
  guichet: 'Guichet',
  dab: 'DAB'
};

function formatMontant(value: number) {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3
  });
}

export function SummaryCards({ summary, seuil }: Props) {
  if (!summary) {
    return null;
  }

  const courbes = [
    { titre: 'Encaissement total', valeur: summary.snapshot.total },
    { titre: 'Seuil réglementaire', valeur: seuil }
  ];

  const cumul = [
    { titre: 'Dépôts', valeur: summary.cumulDepots },
    { titre: 'Retraits', valeur: summary.cumulRetraits },
    { titre: 'Chargements DAB', valeur: summary.cumulChargements },
    { titre: 'Déchargements DAB', valeur: summary.cumulDechargements }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.snapshot}>
        <h2>Position de trésorerie</h2>
        <div className={styles.cards}>
          {locationKeys.map((key) => {
            const titre = labels[key];
            return (
              <article key={key} className={styles.card}>
                <span className={styles.cardLabel}>{titre}</span>
                <strong>{formatMontant(summary.snapshot[key])}</strong>
              </article>
            );
          })}
        </div>
        <div className={styles.metrics}>
          {courbes.map((item) => (
            <div key={item.titre} className={styles.metric}>
              <span>{item.titre}</span>
              <strong>{formatMontant(item.valeur)}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cumul}>
        <h3>Flux cumulés</h3>
        <ul>
          {cumul.map((c) => (
            <li key={c.titre}>
              <span>{c.titre}</span>
              <strong>{formatMontant(c.valeur)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
