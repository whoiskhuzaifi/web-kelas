export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-slate-400" aria-hidden="true" />}
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
