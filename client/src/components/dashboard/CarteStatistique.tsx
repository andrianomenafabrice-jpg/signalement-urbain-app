interface Props {
  label: string;
  valeur: string;
}

export function CarteStatistique({ label, valeur }: Props) {
  return (
    <div className="rounded-lg border border-encre-urbaine/15 dark:border-beton/15 p-4">
      <p className="text-sm opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-display font-bold font-mono tabular-nums">{valeur}</p>
    </div>
  );
}