import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSignalements } from '../../hooks/useReports';
import { useChangerStatutAdmin } from '../../hooks/useAdmin';
import { CATEGORIES, getCategorie } from '../../lib/categories';
import { SelecteurStatut } from './SelecteurStatut';
import { Squelette } from '../ui/Squelette';
import type { Categorie, Statut } from '../../types/report';

export function ListeAdmin() {
  const [categorieFiltre, setCategorieFiltre] = useState<Categorie | null>(null);
  const { data: signalements, isLoading } = useSignalements({ categorie: categorieFiltre });
  const changerStatut = useChangerStatutAdmin();

  return (
    <div className="space-y-3">
      <div className="relative w-fit">
        <select
          value={categorieFiltre ?? ''}
          onChange={(e) => setCategorieFiltre((e.target.value || null) as Categorie | null)}
          className="appearance-none min-h-[44px] pl-3 pr-9 rounded-lg border border-encre-urbaine/25 dark:border-beton/25 bg-transparent text-sm font-medium"
        >
          <option value="">Toutes les categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-encre-urbaine/10 dark:border-beton/10">
              <Squelette className="w-2.5 h-2.5 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Squelette className="h-3.5 w-1/2" />
                <Squelette className="h-3 w-1/3" />
              </div>
              <Squelette className="h-10 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && signalements?.length === 0 && (
        <p className="text-sm opacity-60 text-center py-8">Aucun signalement dans cette categorie.</p>
      )}

      {signalements?.map((signalement) => {
        const meta = getCategorie(signalement.categorie);
        const enCours = changerStatut.isPending && changerStatut.variables?.id === signalement._id;

        return (
          <div
            key={signalement._id}
            className="flex items-center gap-3 p-3 rounded-lg border border-encre-urbaine/10 dark:border-beton/10 hover:border-encre-urbaine/25 dark:hover:border-beton/25 transition-colors"
          >
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.couleur}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{signalement.titre}</p>
              <p className="text-xs opacity-60">{meta.label}</p>
            </div>
            <SelecteurStatut
              statutActuel={signalement.statut}
              chargement={enCours}
              onChangerStatut={(statut: Statut) => changerStatut.mutate({ id: signalement._id, statut })}
            />
          </div>
        );
      })}
    </div>
  );
}