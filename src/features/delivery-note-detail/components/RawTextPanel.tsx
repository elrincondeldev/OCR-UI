import { useState } from 'react';

export function RawTextPanel({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-white shadow">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>Raw Text</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="border-t px-4 py-4">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-600">
            {text || '(empty)'}
          </pre>
        </div>
      )}
    </div>
  );
}
