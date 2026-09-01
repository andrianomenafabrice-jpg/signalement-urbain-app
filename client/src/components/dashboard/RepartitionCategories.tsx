import { CATEGORIES } from '../../lib/categories';

interface Props {
  parCategorie: Record<string, number>;
}

export function RepartitionCategories({ parCategorie }: Props) {
  const total = Object.values(parCategorie).reduce((somme, n) => somme + n, 0) || 1;

  return (
    <div className="space-y-3">
      {CATEGORIES.map((cat) => {
        const count = parCategorie[cat.id] ?? 0;
        const pourcentage = Math.round((count / total) * 100);

        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <cat.icone size={14} />
                {cat.label}
              </span>
              <span className="font-mono tabular-nums opacity-70">{count}</span>
            </div>
            <div className="h-2 rounded-full bg-encre-urbaine/10 dark:bg-beton/10 overflow-hidden">
              <div className={`h-full ${cat.couleur}`} style={{ width: `${pourcentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}