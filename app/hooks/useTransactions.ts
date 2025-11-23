'use client';

import useSWR from 'swr';
import { CashMovement, CashSummary } from '@/lib/types';

export interface TransactionsResponse {
  seuil: number;
  summary: CashSummary;
  movements: CashMovement[];
}

const fetcher = async (url: string): Promise<TransactionsResponse> => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Impossible de récupérer les données');
  }
  return response.json();
};

export function useTransactions() {
  const { data, mutate, error, isLoading } = useSWR<TransactionsResponse>(
    '/api/transactions',
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true
    }
  );

  return {
    seuil: data?.seuil ?? 0,
    summary: data?.summary,
    movements: data?.movements ?? [],
    mutate,
    error,
    isLoading
  };
}
