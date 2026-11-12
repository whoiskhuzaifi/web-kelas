import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/nav';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import Brand from './Brand';

const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition';

export default function SidebarContent({ onNavigate }) {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Brand />
      </div>
      <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-1">
          {items.map(({ id, label, path, icon: Icon, status }) => (
            <li key={id}>
              {status === 'ready' ? (
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      base,
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              ) : (
                <div
                  aria-disabled="true"
                  className={cn(base, 'cursor-not-allowed text-slate-400 dark:text-slate-600')}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Segera
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
