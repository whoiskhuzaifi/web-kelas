import { GraduationCap } from 'lucide-react';

export default function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight">ClassPortal</span>
    </div>
  );
}
