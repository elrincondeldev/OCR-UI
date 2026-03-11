import { apiFetch } from '../../shared/api/client';
import type { DeliveryNotesResponse, FilterType } from '../../shared/types/api';

export function fetchDeliveryNotes(filter: FilterType, skip: number, limit: number) {
  return apiFetch<DeliveryNotesResponse>(
    `/api/v1/delivery-notes?filter=${filter}&skip=${skip}&limit=${limit}`,
  );
}

export function processDeliveryNote(file: File, restaurantId?: string) {
  const form = new FormData();
  form.append('file', file);
  const params = restaurantId
    ? `?restaurant_id=${encodeURIComponent(restaurantId)}`
    : '';
  return apiFetch(`/api/v1/process-delivery-note${params}`, {
    method: 'POST',
    body: form,
  });
}
