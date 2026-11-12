import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Menangkap error render agar satu halaman yang rusak tidak menjatuhkan seluruh aplikasi.
 * `resetKeys`: jika salah satu nilainya berubah (mis. pindah halaman), error otomatis direset.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (!this.state.error) return;
    const prev = prevProps.resetKeys ?? [];
    const next = this.props.resetKeys ?? [];
    if (prev.length !== next.length || prev.some((k, i) => k !== next[i])) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className={cn('flex items-center justify-center p-6', this.props.fullScreen && 'min-h-screen')}
      >
        <div className="card max-w-md text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose-500" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Halaman ini tidak dapat ditampilkan. Coba lagi, atau muat ulang halaman.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-slate-100 p-3 text-left text-xs text-rose-700 dark:bg-slate-800 dark:text-rose-300">
              {String(error?.message ?? error)}
            </pre>
          )}
          <div className="mt-4 flex justify-center gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => this.setState({ error: null })}>
              Coba lagi
            </button>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Muat ulang
            </button>
          </div>
        </div>
      </div>
    );
  }
}
