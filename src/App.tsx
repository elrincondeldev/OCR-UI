import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './shared/components/Toaster';
import { DeliveryNotesPage } from './features/delivery-notes/DeliveryNotesPage';
import { DeliveryNoteDetailPage } from './features/delivery-note-detail/DeliveryNoteDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<DeliveryNotesPage />} />
          <Route path="/delivery-notes/:id" element={<DeliveryNoteDetailPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
