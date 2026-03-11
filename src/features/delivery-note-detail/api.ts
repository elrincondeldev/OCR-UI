import { apiJson } from '../../shared/api/client';
import type { DeliveryNoteListItem, ValidatePatchBody } from '../../shared/types/api';

export function validateDeliveryNote(id: string, body: ValidatePatchBody) {
  return apiJson<DeliveryNoteListItem>(`/api/v1/delivery-notes/${id}/validate`, {
    method: 'PATCH',
    body,
  });
}
