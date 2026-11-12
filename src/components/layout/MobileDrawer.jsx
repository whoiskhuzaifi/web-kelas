import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import SidebarContent from './SidebarContent';

// Drawer navigasi untuk layar kecil, memakai <dialog> agar focus trap dan Esc ditangani browser.
export default function MobileDrawer({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Menu navigasi"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-0 mr-auto h-dvh max-h-none w-72 max-w-[85vw] border-r border-slate-200 bg-white p-0 text-slate-900 backdrop:bg-slate-950/60 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup menu"
        className="btn btn-ghost absolute right-3 top-4 h-9 w-9 p-0"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      <SidebarContent onNavigate={onClose} />
    </dialog>
  );
}
