import type { Ingredient } from '../../../shared/types/api';
import { IngredientRow, calcLineTotal } from './IngredientRow';

interface Props {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

function emptyIngredient(): Ingredient {
  return {
    price_per_format: 0,
    format_quantity: 1,
    requires_review: false,
    low_confidence_tokens: [],
  };
}

export function IngredientsTable({ ingredients, onChange }: Props) {
  const update = (index: number, updated: Ingredient) =>
    onChange(ingredients.map((ing, i) => (i === index ? updated : ing)));

  const remove = (index: number) => onChange(ingredients.filter((_, i) => i !== index));

  const add = () => onChange([...ingredients, emptyIngredient()]);

  // Grand total — sum lines where quantity is present; track how many are uncalculable
  const { grandTotal, missing } = ingredients.reduce(
    (acc, ing) => {
      const t = calcLineTotal(ing);
      if (t == null) return { ...acc, missing: acc.missing + 1 };
      return { ...acc, grandTotal: acc.grandTotal + t };
    },
    { grandTotal: 0, missing: 0 },
  );

  const hasRows = ingredients.length > 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Qty</th>
              <th className="px-2 py-2">Unit</th>
              <th className="px-2 py-2">Price/Format</th>
              <th className="px-2 py-2">VAT %</th>
              <th className="px-2 py-2">Discount %</th>
              <th className="px-2 py-2">Format Qty</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>

          <tbody>
            {!hasRows ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-400">
                  No ingredients
                </td>
              </tr>
            ) : (
              ingredients.map((ing, i) => (
                <IngredientRow
                  key={i}
                  ingredient={ing}
                  onChange={(updated) => update(i, updated)}
                  onRemove={() => remove(i)}
                />
              ))
            )}
          </tbody>

          {hasRows && (
            <tfoot>
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td
                  colSpan={7}
                  className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {missing > 0
                    ? `Calculated total (${missing} line${missing > 1 ? 's' : ''} missing qty)`
                    : 'Total'}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  <span className="text-base font-bold text-gray-900">
                    €{grandTotal.toFixed(2)}
                  </span>
                  {missing > 0 && (
                    <span className="ml-1 text-xs text-gray-400">*</span>
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <button
        type="button"
        onClick={add}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add ingredient
      </button>
    </div>
  );
}
