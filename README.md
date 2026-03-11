# OCR-UI

A React frontend for reviewing and validating OCR-extracted delivery notes. Upload supplier documents, inspect automatically parsed data, correct errors, and submit validated records — all in one focused interface.

---

## What It Does

When a delivery note (PDF or image) is uploaded, the backend OCR service extracts structured data: supplier details, line-item ingredients, totals, VAT, and discounts. OCR-UI provides a quality-control layer where operators can:

- Browse all processed delivery notes with status filtering
- Open a split-screen review view showing the source document alongside extracted fields
- Edit any header field or ingredient row that was parsed incorrectly
- Submit only the changed data back to the API (patch semantics)
- Flag ingredients that need further attention

---

## Screenshots

> _Add screenshots here once the UI is stable._

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + React Router 7 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Build | Vite |
| Backend | REST API at `http://localhost:3000` |

No external component libraries — all UI is built with Tailwind utility classes.

---

## Getting Started

### Prerequisites

- Node.js 18+
- The OCR backend running at `http://localhost:3000`

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot-reload.

### Build (production)

```bash
npm run build
```

Output goes to `dist/`. Preview with `npm run preview`.

---

## API

The frontend talks to these endpoints on the backend:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/process-delivery-note` | Upload a file for OCR processing (multipart) |
| `GET` | `/api/v1/delivery-notes` | List delivery notes with filter + pagination |
| `PATCH` | `/api/v1/delivery-notes/:id/validate` | Submit corrections for a document |
| `GET` | `/health` | Backend health check |

The base URL is set in [`src/shared/api/client.ts`](src/shared/api/client.ts). Change it there to point at a different environment.

---

## Project Structure

```
src/
├── shared/
│   ├── api/client.ts          # apiFetch / apiJson helpers + base URL
│   ├── types/api.ts           # TypeScript types for all API shapes
│   └── components/Toaster.tsx # Toast notifications (Context + useToast hook)
│
└── features/
    ├── delivery-notes/
    │   ├── DeliveryNotesPage.tsx   # List page
    │   ├── api.ts
    │   ├── hooks/useDeliveryNotes.ts
    │   └── components/            # FilterTabs, StatusBadge, Pagination, UploadModal
    │
    └── delivery-note-detail/
        ├── DeliveryNoteDetailPage.tsx  # Split-screen review page
        ├── api.ts
        └── components/               # HeaderFields, IngredientsTable, IngredientRow, RawTextPanel
```

---

## License

MIT
