'use client';

import { useState } from 'react';
import styles from './TransactionForm.module.css';
import { KeyedMutator } from 'swr';
import { TransactionsResponse } from '@/app/hooks/useTransactions';

interface Props {
  mutate: KeyedMutator<TransactionsResponse>;
}

interface OptionSet {
  origine: string[];
  destination: string[];
}

const TYPE_OPTIONS: Record<string, { label: string; options: OptionSet }> = {
  depot: {
    label: 'Versement client',
    options: {
      origine: ['client', 'transport', 'externe'],
      destination: ['guichet', 'coffre']
    }
  },
  retrait: {
    label: 'Retrait guichet/DAB',
    options: {
      origine: ['guichet', 'dab'],
      destination: ['client']
    }
  },
  atm_chargement: {
    label: 'Chargement DAB',
    options: {
      origine: ['coffre'],
      destination: ['dab']
    }
  },
  atm_dechargement: {
    label: 'Déchargement DAB',
    options: {
      origine: ['dab'],
      destination: ['coffre']
    }
  },
  ajustement: {
    label: 'Ajustement interne',
    options: {
      origine: ['coffre', 'guichet', 'dab'],
      destination: ['coffre', 'guichet', 'dab']
    }
  }
};

const DEFAULT_FORM = {
  type: 'depot',
  montant: '1000',
  origine: 'client',
  destination: 'guichet',
  operateur: 'Agent caisse',
  commentaire: ''
};

export function TransactionForm({ mutate }: Props) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const optionSet = TYPE_OPTIONS[form.type]?.options ?? TYPE_OPTIONS.depot.options;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'type') {
      const defaults = TYPE_OPTIONS[value]?.options;
      setForm((prev) => ({
        ...prev,
        type: value,
        origine: defaults?.origine[0] ?? prev.origine,
        destination: defaults?.destination[0] ?? prev.destination
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          montant: Number(form.montant)
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.erreurs?.join(', ') ?? payload.message ?? 'Erreur inconnue');
        return;
      }

      setStatus('Mouvement enregistré avec succès.');
      setForm({
        ...DEFAULT_FORM,
        type: form.type,
        origine: optionSet.origine[0],
        destination: optionSet.destination[0]
      });
      mutate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Enregistrer un mouvement</h2>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nature d&apos;opération</span>
          <select
            className={styles.select}
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {Object.entries(TYPE_OPTIONS).map(([value, option]) => (
              <option key={value} value={value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Montant (TND)</span>
          <input
            className={styles.input}
            name="montant"
            type="number"
            min="1"
            value={form.montant}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span>Origine</span>
          <select
            className={styles.select}
            name="origine"
            value={form.origine}
            onChange={handleChange}
          >
            {optionSet.origine.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Destination</span>
          <select
            className={styles.select}
            name="destination"
            value={form.destination}
            onChange={handleChange}
          >
            {optionSet.destination.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Opérateur</span>
          <input
            className={styles.input}
            name="operateur"
            value={form.operateur}
            onChange={handleChange}
            placeholder="Nom de l\'agent"
            required
          />
        </label>
        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span>Commentaire</span>
          <input
            className={styles.input}
            name="commentaire"
            value={form.commentaire}
            onChange={handleChange}
            placeholder="Détails optionnels"
          />
        </label>
      </div>
      <div className={styles.feedback}>
        {status && <span className={styles.success}>{status}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
      <button className={styles.submit} type="submit" disabled={submitting}>
        {submitting ? 'Enregistrement...' : 'Valider le mouvement'}
      </button>
    </form>
  );
}
