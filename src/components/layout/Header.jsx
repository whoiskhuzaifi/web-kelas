import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { ROLE_LABEL } from '../../config/nav';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../services/authService';
import ConfirmDialog from '../common/ConfirmDialog';
import ThemeToggle from '../common/ThemeToggle';
import Brand from './Brand';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.');
      setLoggingOut(false);
      setConfirmOpen(false);
    }
    // Jika berhasil, AuthContext mengosongkan sesi dan seluruh layout ini dilepas.
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka menu"
        className="btn btn-ghost h-10 w-10 p-0 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="lg:hidden">
        <Brand />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden text-right sm:block">
          <p className="max-w-[12rem] truncate text-sm font-medium leading-tight">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{ROLE_LABEL[user.role]}</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="btn btn-ghost h-10 w-10 p-0"
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Keluar dari ClassPortal?"
        description="Anda perlu masuk kembali untuk mengakses portal."
        confirmLabel="Keluar"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </header>
  );
}
