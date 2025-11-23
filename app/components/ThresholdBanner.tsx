'use client';

import styles from './ThresholdBanner.module.css';

interface Props {
  total: number;
  seuil: number;
}

function formatMontant(value: number) {
  return value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3
  });
}

export function ThresholdBanner({ total, seuil }: Props) {
  const depassement = total > seuil;
  const ratio = seuil > 0 ? (total / seuil) * 100 : 0;

  return (
    <div className={depassement ? styles.alert : styles.ok}>
      <div>
        <strong>
          {depassement ? 'Alerte seuil encaissement' : 'Encaissement sous contrôle'}
        </strong>
        <p className={styles.message}>
          Encaissement actuel {formatMontant(total)} sur un seuil de {formatMontant(seuil)} ({
            ratio.toFixed(1)
          }
          %).
        </p>
      </div>
    </div>
  );
}
