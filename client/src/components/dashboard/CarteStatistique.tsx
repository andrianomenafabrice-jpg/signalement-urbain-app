import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  valeur: string;
  icone: LucideIcon;
  accent?: string;
}

export function CarteStatistique({ label, valeur, icone: Icone, accent = 'text-encre-urbaine dark:text-beton' }: Props) {
  return (
    <div className="rounded-lg border border-encre-urbaine/12 dark:border-beton/12 p-4 flex items-start justify-between">
      <div>
        <p className="text-sm opacity-60 mb-1.5">{label}</p>
        <p className="text-2xl font-display font-bold font-mono tabular-nums">{valeur}</p>
      </div>
      <Icone size={20} className={`${accent} opacity-70 mt-0.5`} />
    </div>
  );
}