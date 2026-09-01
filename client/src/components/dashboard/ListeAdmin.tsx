import { useState } from 'react';
import { useSignalements } from '../../hooks/useReports';
import { useChangerStatutAdmin } from '../../hooks/useAdmin';
import { CATEGORIES, getCategorie } from '../../lib/categories';
import { transitionsPossibles } from '../../lib/statutTransitions';
import type { Categorie, Statut } from '../../types/report';

const LABEL_STATUT: Record<Statut, string> = {
  signale: 'Signale',
  en_cours: 'En cours',
  resolu: 'Resolu',
};

export function ListeAdmin() {
  const [categorieFiltre, setCategorieFiltre] = useState<Categorie | null>(null);
  const { data: signalements, isLoading } = useSignalements({ categorie: categorieFiltre });
  const changerStatut = useChangerStatutAdmin();

  return (
    <div className="space-y-3">
      <select
        value={categorieFiltre ?? ''}
        onChange={(e) => setCategorieFiltre((e.target.value || null) as Categorie | null)}
        className="min-h-[44px] px-3 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent"
      >
        <option value="">Toutes les categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.label}</option>
        ))}
      </select>

      {isLoading && <p className="text-sm opacity-70">Chargement…</p>}

      {signalements?.map((signalement) => {
        const meta = getCategorie(signalement.categorie);
        const options = transitionsPossibles(signalement.statut);

        return (
          <div
            key={signalement._id}
            className="flex items-center gap-3 p-3 rounded-lg border border-encre-urbaine/15 dark:border-beton/15"
          >
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.couleur}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{signalement.titre}</p>
              <p className="text-xs opacity-70">{meta.label} · {LABEL_STATUT[signalement.statut]}</p>
            </div>
            <select
              value=""
              disabled={changerStatut.isPending || options.length === 0}
              onChange={(e) => {
                const nouveauStatut = e.target.value as Statut;
                if (nouveauStatut) {
                  changerStatut.mutate({ id: signalement._id, statut: nouveauStatut });
                }
              }}
              className="min-h-[44px] px-2 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent text-sm shrink-0"
            >
              <option value="">Changer le statut</option>
              {options.map((statut) => (
                <option key={statut} value={statut}>{LABEL_STATUT[statut]}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}