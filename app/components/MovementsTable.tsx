'use client';

import { CashMovement } from '@/lib/types';
import styles from './MovementsTable.module.css';

interface Props {
  movements: CashMovement[];
}

const LABELS: Record<CashMovement['type'], string> = {
  depot: 'Versement',
  retrait: 'Retrait',
  atm_chargement: 'Chargement DAB',
  atm_dechargement: 'Déchargement DAB',
  ajustement: 'Ajustement'
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  });
}

function formatMontant(value: number) {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3
  });
}

export function MovementsTable({ movements }: Props) {
  if (movements.length === 0) {
    return <p className={styles.empty}>Aucun mouvement enregistré.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Horodatage</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Origine</th>
            <th>Destination</th>
            <th>Opérateur</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td>{formatDate(movement.horodatage)}</td>
              <td>{LABELS[movement.type]}</td>
              <td>{formatMontant(movement.montant)}</td>
              <td>{movement.origine}</td>
              <td>{movement.destination}</td>
              <td>{movement.operateur}</td>
              <td>{movement.commentaire ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
