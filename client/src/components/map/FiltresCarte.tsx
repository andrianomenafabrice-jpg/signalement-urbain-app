import { CATEGORIES } from '../../lib/categories';
import type { Categorie } from '../../types/report';

interface Props {
  categorieActive: Categorie | null;
  onChange: (categorie: Categorie | null) => void;
}

export function FiltresCarte({ categorieActive, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-beton dark:bg-bitume border-b border-encre-urbaine/10 dark:border-beton/10">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border transition-all active:scale-[0.96] ${
          categorieActive === null
            ? 'bg-encre-urbaine text-beton border-encre-urbaine dark:bg-beton dark:text-bitume'
            : 'border-encre-urbaine/25 text-encre-urbaine dark:text-beton dark:border-beton/25 hover:border-encre-urbaine/50 dark:hover:border-beton/50'
        }`}
      >
        Tout
      </button>
      {CATEGORIES.map((cat) => {
        const actif = categorieActive === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(actif ? null : cat.id)}
            className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border flex items-center gap-2 transition-all active:scale-[0.96] ${
              actif
                ? `${cat.couleur} text-beton border-transparent shadow-sm`
                : 'border-encre-urbaine/25 text-encre-urbaine dark:text-beton dark:border-beton/25 hover:border-encre-urbaine/50 dark:hover:border-beton/50'
            }`}
          >
            <cat.icone size={16} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}