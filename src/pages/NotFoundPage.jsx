import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Halaman tidak ditemukan');
  return (
    <EmptyState
      icon={SearchX}
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak ada atau modulnya belum tersedia."
      action={
        <Link to="/" className="btn btn-primary">
          Kembali ke Dashboard
        </Link>
      }
    />
  );
}
