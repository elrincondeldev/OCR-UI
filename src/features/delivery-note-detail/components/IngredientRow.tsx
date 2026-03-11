import type { Ingredient, UnitType } from '../../../shared/types/api';

const UNITS: UnitType[] = ['kg', 'g', 'l', 'ml', 'unit', 'box', 'crate', 'pack'];

interface Props {
  ingredient: Ingredient;
  onChange: (updated: Ingredient) => void;
  onRemove: () => void;
}

/** Returns null when quantity is missing and the total cannot be computed. */
export function calcLineTotal(ing: Ingredient): number | null {
  if (ing.quantity == null) return null;
  const base = ing.quantity * ing.price_per_format;
  const afterDiscount = base * (1 - (ing.discount ?? 0) / 100);
  const afterVat = afterDiscount * (1 + (ing.vat_percentage ?? 0) / 100);
  return afterVat;
}

function fmt(n: number) {
  return `€${n.toFixed(2)}`;
}

function NumInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      className="w-full rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}

export function IngredientRow({ ingredient, onChange, onRemove }: Props) {
  console.log(ingredient);
  const highlight = ingredient.requires_review
    ? 'bg-amber-50 hover:bg-amber-100/60'
    : 'hover:bg-gray-50';

  const lineTotal = calcLineTotal(ingredient);

  return (
    <tr className={`border-b transition-colors ${highlight}`}>
      {/* Name — includes warning, chips, algolia suggestion */}
      <td className="px-2 py-2 min-w-[200px]">
        <TextInput
          value={ingredient.name}
          placeholder="Ingredient name"
          onChange={(v) => onChange({ ...ingredient, name: v })}
        />
        {ingredient.requires_review && ingredient.algolia_match && (
          <button
            type="button"
            onClick={() =>
              onChange({ ...ingredient, name: ingredient.algolia_match!.matched_item_name })
            }
            className="mt-1 text-xs text-blue-600 hover:underline"
          >
            Did you mean: <strong>{ingredient.algolia_match.matched_item_name}</strong>?
          </button>
        )}
        {ingredient.requires_review && ingredient.human_warning_message && (
          <p className="mt-1 text-xs text-amber-700">⚠ {ingredient.human_warning_message}</p>
        )}
        {ingredient.requires_review && (
          <div className="mt-1 flex flex-wrap gap-1">
            {ingredient.low_confidence_tokens.map((token, i) => (
              <span key={i} className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-700">
                {token}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Quantity */}
      <td className="px-2 py-2 w-20">
        <NumInput
          value={ingredient.quantity}
          onChange={(v) => onChange({ ...ingredient, quantity: v })}
        />
      </td>

      {/* Unit */}
      <td className="px-2 py-2 w-24">
        <select
          value={ingredient.unit ?? ''}
          onChange={(e) =>
            onChange({ ...ingredient, unit: (e.target.value as UnitType) || undefined })
          }
          className="w-full rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">—</option>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </td>

      {/* Price per format */}
      <td className="px-2 py-2 w-28">
        <NumInput
          value={ingredient.price_per_format}
          onChange={(v) => onChange({ ...ingredient, price_per_format: v ?? 0 })}
        />
      </td>

      {/* VAT % */}
      <td className="px-2 py-2 w-20">
        <NumInput
          value={ingredient.vat_percentage}
          onChange={(v) => onChange({ ...ingredient, vat_percentage: v })}
        />
      </td>

      {/* Discount % */}
      <td className="px-2 py-2 w-24">
        <NumInput
          value={ingredient.discount}
          onChange={(v) => onChange({ ...ingredient, discount: v })}
        />
      </td>

      {/* Format qty */}
      <td className="px-2 py-2 w-24">
        <NumInput
          value={ingredient.format_quantity}
          onChange={(v) => onChange({ ...ingredient, format_quantity: v ?? 1 })}
        />
      </td>

      {/* Calculated total — read-only */}
      <td className="px-3 py-2 w-28 text-right tabular-nums">
        {lineTotal != null ? (
          <span className="font-medium text-gray-800">{fmt(lineTotal)}</span>
        ) : (
          <span className="text-gray-300" title="Enter quantity to calculate">—</span>
        )}
      </td>

      {/* Remove */}
      <td className="px-2 py-2 w-10 text-center">
        <button
          type="button"
          onClick={onRemove}
          title="Remove"
          className="text-gray-300 hover:text-red-500"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
