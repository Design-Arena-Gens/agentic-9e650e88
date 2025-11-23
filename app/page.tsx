'use client';

import { useTransactions } from './hooks/useTransactions';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { MovementsTable } from './components/MovementsTable';
import { ThresholdBanner } from './components/ThresholdBanner';
import styles from './page.module.css';

export default function Home() {
  const { summary, movements, seuil, isLoading, error, mutate } = useTransactions();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Contrôle des flux de trésorerie</h1>
          <p>
            Supervisez en temps réel les mouvements de caisse, le respect du seuil réglementaire et la
            situation du DAB pour garantir la stabilité financière de l&apos;agence.
          </p>
        </div>
      </header>

      {summary && <ThresholdBanner total={summary.snapshot.total} seuil={seuil} />}

      {isLoading && <p className={styles.info}>Chargement des données...</p>}
      {error && <p className={styles.error}>Erreur de chargement : {error.message}</p>}

      <div className={styles.grid}>
        <SummaryCards summary={summary} seuil={seuil} />
        <TransactionForm mutate={mutate} />
      </div>

      <section className={styles.section}>
        <h2>Historique des mouvements</h2>
        <MovementsTable movements={movements} />
      </section>
    </main>
  );
}
