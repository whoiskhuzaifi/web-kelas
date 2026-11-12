import Brand from './Brand';
import ThemeToggle from '../common/ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mb-6">
        <Brand />
      </div>
      <main className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="text-xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </main>
      {footer && <div className="mt-4 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
    </div>
  );
}
