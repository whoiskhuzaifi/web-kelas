import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// `ref` diteruskan lewat props (React 19), sehingga kompatibel dengan register() dari react-hook-form.
export default function PasswordInput({ id, hasError, describedBy, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="input pr-11"
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
