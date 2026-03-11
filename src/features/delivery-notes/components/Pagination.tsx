interface Props {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-gray-50"
      >
        Prev
      </button>
      <span className="text-gray-500">
        {page + 1} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        className="rounded border px-3 py-1 disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
