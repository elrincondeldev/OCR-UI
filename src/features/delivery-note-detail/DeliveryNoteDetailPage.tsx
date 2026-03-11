import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type {
  DeliveryNoteListItem,
  Ingredient,
  ValidatePatchBody,
} from "../../shared/types/api";
import { validateDeliveryNote } from "./api";
import { HeaderFields } from "./components/HeaderFields";
import type { HeaderFormData } from "./components/HeaderFields";
import { IngredientsTable } from "./components/IngredientsTable";
import { RawTextPanel } from "./components/RawTextPanel";
import { DocumentViewer } from "./components/DocumentViewer";
import { StatusBadge } from "../delivery-notes/components/StatusBadge";
import { useToast } from "../../shared/components/Toaster";

function toStr(v: string | number | undefined | null): string {
  if (v == null) return "";
  return String(v);
}

function initHeader(item: DeliveryNoteListItem): HeaderFormData {
  return {
    supplier_name: toStr(item.supplier_name),
    supplier_id: toStr(item.supplier_id),
    date: toStr(item.date),
    serial_number: toStr(item.serial_number),
    total_vat: toStr(item.total_vat),
    total_discount: toStr(item.total_discount),
    total_expense: toStr(item.total_expense),
    image_url: toStr(item.image_url),
  };
}

export function DeliveryNoteDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();

  const item: DeliveryNoteListItem | undefined = location.state?.item;

  const [header, setHeader] = useState<HeaderFormData>(() =>
    item ? initHeader(item) : ({} as HeaderFormData),
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    () => item?.delivery_note_ingredients ?? [],
  );
  const [ingredientsTouched, setIngredientsTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  console.log("items");
  console.log("header", header);
  console.log("ingredients", ingredients);
  console.log("ingredientsTouched", ingredientsTouched);
  console.log("submitting", submitting);

  if (!item) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No delivery note selected.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to list
          </button>
        </div>
      </div>
    );
  }

  const handleHeaderChange = (field: keyof HeaderFormData, value: string) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientsChange = (updated: Ingredient[]) => {
    setIngredients(updated);
    setIngredientsTouched(true);
  };

  const handleValidate = async () => {
    const body: ValidatePatchBody = {};
    const orig = initHeader(item);

    if (header.supplier_name !== orig.supplier_name)
      body.supplier_name = header.supplier_name;
    if (header.supplier_id !== orig.supplier_id)
      body.supplier_id = header.supplier_id;
    if (header.date !== orig.date) body.date = header.date;
    if (header.serial_number !== orig.serial_number)
      body.serial_number = header.serial_number;
    if (header.total_vat !== orig.total_vat) {
      body.total_vat =
        header.total_vat !== "" ? Number(header.total_vat) : undefined;
    }
    if (header.total_discount !== orig.total_discount) {
      body.total_discount =
        header.total_discount !== ""
          ? Number(header.total_discount)
          : undefined;
    }
    if (header.total_expense !== orig.total_expense) {
      body.total_expense =
        header.total_expense !== "" ? Number(header.total_expense) : undefined;
    }
    if (ingredientsTouched) {
      body.delivery_note_ingredients = ingredients;
    }

    setSubmitting(true);
    try {
      await validateDeliveryNote(id!, body);
      toast("Delivery note validated", "success");
      navigate("/");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Validation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const reviewCount = ingredients.filter((ing) => ing.requires_review).length;
  const imageUrl = header.image_url
    ? `http://localhost:3000${header.image_url}`
    : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* ── Top bar ── */}
      <header className="flex shrink-0 items-center gap-3 border-b bg-white px-6 py-3 shadow-sm">
        <button
          onClick={() => navigate("/")}
          className="shrink-0 text-sm text-gray-400 hover:text-gray-700"
        >
          ← Back
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold text-gray-900">
            {item.filename}
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            {item.has_issues && (
              <span className="text-xs text-amber-600">⚠ has issues</span>
            )}
            {reviewCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {reviewCount} ingredient{reviewCount > 1 ? "s" : ""} need review
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleValidate}
          disabled={submitting}
          className="shrink-0 rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Validating…" : "Validate"}
        </button>
      </header>

      {/* ── Split body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — document viewer */}
        <aside className="flex w-[44%] shrink-0 flex-col overflow-y-auto border-r bg-gray-100">
          <div className="shrink-0 border-b bg-white px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Source document
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            {imageUrl ? (
              <DocumentViewer src={imageUrl} alt={item.filename} />
            ) : (
              <div className="h-full overflow-y-auto p-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Raw text
                  </p>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-700">
                    {item.raw_text || "(empty)"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right panel — editable form */}
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
            {/* Header fields */}
            <section className="rounded-lg bg-white shadow-sm">
              <div className="border-b px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Header fields
                </h2>
              </div>
              <div className="p-5">
                <HeaderFields data={header} onChange={handleHeaderChange} />
              </div>
            </section>

            {/* Ingredients */}
            <section className="rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Ingredients
                  <span className="ml-2 font-normal normal-case text-gray-400">
                    ({ingredients.length})
                  </span>
                </h2>
                {reviewCount > 0 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {reviewCount} flagged
                  </span>
                )}
              </div>
              <div className="p-5">
                <IngredientsTable
                  ingredients={ingredients}
                  onChange={handleIngredientsChange}
                />
              </div>
            </section>

            {/* Raw text — only as fallback when image is already shown */}
            {imageUrl && <RawTextPanel text={item.raw_text} />}
          </div>
        </main>
      </div>
    </div>
  );
}
