import { useState, useEffect, useCallback } from 'react';
import { fetchDeliveryNotes } from '../api';
import type { DeliveryNoteListItem, FilterType } from '../../../shared/types/api';

export const PAGE_SIZE = 20;

export function useDeliveryNotes() {
  const [filter, setFilterState] = useState<FilterType>('all');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<DeliveryNoteListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDeliveryNotes(filter, page * PAGE_SIZE, PAGE_SIZE);
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFilter = (f: FilterType) => {
    setFilterState(f);
    setPage(0);
  };

  return { items, total, loading, error, filter, page, changeFilter, setPage, reload: load };
}
