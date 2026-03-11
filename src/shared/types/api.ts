export type DeliveryNoteStatus = 'pending' | 'processed' | 'validated' | 'error';

export type UnitType = 'kg' | 'g' | 'l' | 'ml' | 'unit' | 'box' | 'crate' | 'pack';

export interface AlgoliaMatch {
  object_id: string;
  matched_item_name: string;
  standard_quantity?: string;
}

export interface Ingredient {
  name?: string;
  price_per_format: number;
  quantity?: number;
  vat_percentage?: number;
  discount?: number;
  format_quantity: number;
  unit?: UnitType;
  requires_review: boolean;
  low_confidence_tokens: string[];
  algolia_match?: AlgoliaMatch;
  human_warning_message?: string;
}

export interface DeliveryNoteListItem {
  id: string;
  filename: string;
  status: DeliveryNoteStatus;
  validated: boolean;
  has_issues: boolean;
  restaurant_id?: string;
  supplier_id?: string;
  supplier_name?: string;
  date?: string;
  serial_number?: string;
  total_vat?: number;
  total_discount?: number;
  total_expense?: number;
  raw_text: string;
  delivery_note_ingredients: Ingredient[];
  created_at: string;
  image_url?: string;
}

export interface DeliveryNotesResponse {
  total: number;
  items: DeliveryNoteListItem[];
}

export type FilterType = 'all' | 'validated' | 'non_validated';

export interface ValidatePatchBody {
  supplier_name?: string;
  supplier_id?: string;
  date?: string;
  serial_number?: string;
  total_vat?: number;
  total_discount?: number;
  total_expense?: number;
  delivery_note_ingredients?: Ingredient[];
}
