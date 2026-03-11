export interface HeaderFormData {
  supplier_name: string;
  supplier_id: string;
  date: string;
  serial_number: string;
  total_vat: string;
  total_discount: string;
  total_expense: string;
  image_url: string;
}

interface Props {
  data: HeaderFormData;
  onChange: (field: keyof HeaderFormData, value: string) => void;
}

function Field({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </p>
  );
}

export function HeaderFields({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Supplier */}
      <div>
        <SectionLabel>Supplier</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Name"
            id="supplier_name"
            value={data.supplier_name}
            placeholder="e.g. Acme Foods"
            onChange={(v) => onChange('supplier_name', v)}
          />
          <Field
            label="Supplier ID"
            id="supplier_id"
            value={data.supplier_id}
            placeholder="e.g. SUP-001"
            onChange={(v) => onChange('supplier_id', v)}
          />
        </div>
      </div>

      {/* Document */}
      <div>
        <SectionLabel>Document</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Date"
            id="date"
            type="date"
            value={data.date}
            onChange={(v) => onChange('date', v)}
          />
          <Field
            label="Serial Number"
            id="serial_number"
            value={data.serial_number}
            placeholder="e.g. DN-2024-0042"
            onChange={(v) => onChange('serial_number', v)}
          />
        </div>
      </div>

      {/* Totals */}
      <div>
        <SectionLabel>Totals</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <Field
            label="VAT"
            id="total_vat"
            type="number"
            value={data.total_vat}
            placeholder="0.00"
            onChange={(v) => onChange('total_vat', v)}
          />
          <Field
            label="Discount"
            id="total_discount"
            type="number"
            value={data.total_discount}
            placeholder="0.00"
            onChange={(v) => onChange('total_discount', v)}
          />
          <Field
            label="Total Expense"
            id="total_expense"
            type="number"
            value={data.total_expense}
            placeholder="0.00"
            onChange={(v) => onChange('total_expense', v)}
          />
        </div>
      </div>
    </div>
  );
}
