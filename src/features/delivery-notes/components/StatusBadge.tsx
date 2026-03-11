import type { DeliveryNoteStatus } from '../../../shared/types/api';

const CONFIG: Record<DeliveryNoteStatus, { label: string; classes: string }> = {
  pending: { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' },
  processed: { label: 'Processed', classes: 'bg-blue-100 text-blue-800' },
  validated: { label: 'Validated', classes: 'bg-green-100 text-green-800' },
  error: { label: 'Error', classes: 'bg-red-100 text-red-800' },
};

export function StatusBadge({ status }: { status: DeliveryNoteStatus }) {
  const { label, classes } = CONFIG[status] ?? CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
