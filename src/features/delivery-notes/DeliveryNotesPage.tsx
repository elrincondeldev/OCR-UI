import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryNotes, PAGE_SIZE } from './hooks/useDeliveryNotes';
import { FilterTabs } from './components/FilterTabs';
import { StatusBadge } from './components/StatusBadge';
import { Pagination } from './components/Pagination';
import { UploadModal } from './components/UploadModal';
import { useToast } from '../../shared/components/Toaster';

function formatDate(str?: string) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString();
}

function formatCurrency(n?: number) {
  if (n == null) return '—';
  return `€${n.toFixed(2)}`;
}

export function DeliveryNotesPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, total, loading, error, filter, page, changeFilter, setPage, reload } =
    useDeliveryNotes();
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    toast('Delivery note uploaded successfully', 'success');
    reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Notes</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Upload
          </button>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-4 pt-4">
            <FilterTabs active={filter} onChange={changeFilter} />
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Loading…</div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              No delivery notes found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Issues</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-gray-600">
                        {item.filename}
                      </td>
                      <td className="px-4 py-3">{item.supplier_name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(item.date)}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(item.total_expense)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.has_issues && (
                          <span title="Has issues" className="text-amber-500">
                            ⚠
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(item.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            navigate(`/delivery-notes/${item.id}`, { state: { item } })
                          }
                          className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-gray-500">{total} total</span>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
          </div>
        </div>
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={handleUploadSuccess} />
      )}
    </div>
  );
}
