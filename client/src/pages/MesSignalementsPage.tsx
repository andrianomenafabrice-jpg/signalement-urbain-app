import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useMesSignalements } from '../hooks/useReports';
import { getCategorie } from '../lib/categories';
import { HistoriqueStatut } from '../components/report/HistoriqueStatut';
import type { Statut } from '../types/report';

const PASTILLE_STATUT: Record<Statut, string> = {
  signale: '○',
  en_cours: '◐',
  resolu: '●',
};

const LABEL_STATUT: Record<Statut, string> = {
  signale: 'Signale',
  en_cours: 'En cours',
  resolu: 'Resolu',
};

function formaterDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function MesSignalementsPage() {
  const [statutActif, setStatutActif] = useState<Statut | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const { data: signalements, isLoading, isError } = useMesSignalements({ statut: statutActif });
  const urlBase = (import.meta.env.VITE_API_URL as string).replace(/\/api\/?$/, '');

  const statuts: Statut[] = ['signale', 'en_cours', 'resolu'];

  return (
    <div className="min-h-screen bg-beton dark:bg-bitume">
      <Helmet>
        <title>Mes signalements — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="px-4 py-3 flex items-center gap-3 border-b border-encre-urbaine/10">
        <Link to="/" aria-label="Retour a la carte" className="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-xl font-display font-bold">Mes signalements</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        <button
          type="button"
          onClick={() => setStatutActif(null)}
          className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border ${
            statutActif === null
              ? 'bg-encre-urbaine text-beton border-encre-urbaine dark:bg-beton dark:text-bitume'
              : 'border-encre-urbaine/30 dark:border-beton/30'
          }`}
        >
          Tout
        </button>
        {statuts.map((statut) => (
          <button
            key={statut}
            type="button"
            onClick={() => setStatutActif(statutActif === statut ? null : statut)}
            className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border font-mono ${
              statutActif === statut
                ? 'bg-encre-urbaine text-beton border-encre-urbaine dark:bg-beton dark:text-bitume'
                : 'border-encre-urbaine/30 dark:border-beton/30'
            }`}
          >
            {PASTILLE_STATUT[statut]} {LABEL_STATUT[statut]}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8 space-y-3">
        {isLoading && <p className="text-sm opacity-70">Chargement…</p>}
        {isError && <p className="text-sm text-marquage-voirie">Impossible de charger tes signalements.</p>}

        {!isLoading && !isError && signalements?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm opacity-70 mb-4">Tu n'as encore rien signale.</p>
            <Link to="/" className="underline text-sm">Retourner a la carte</Link>
          </div>
        )}

        {signalements?.map((signalement) => {
          const meta = getCategorie(signalement.categorie);
          const estOuvert = ouvert === signalement._id;

          return (
            <div key={signalement._id} className="rounded-lg border border-encre-urbaine/15 dark:border-beton/15 overflow-hidden">
              <button
                type="button"
                onClick={() => setOuvert(estOuvert ? null : signalement._id)}
                className="w-full flex items-center gap-3 p-3 text-left min-h-[64px]"
              >
                {signalement.photos[0] && (
                  <img
                    src={`${urlBase}${signalement.photos[0]}`}
                    alt=""
                    className="w-14 h-14 rounded object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${meta.couleur}`} />
                    <span className="text-xs opacity-70">{meta.label}</span>
                  </div>
                  <p className="font-medium truncate">{signalement.titre}</p>
                  <p className="font-mono text-xs tabular-nums opacity-70">
                    {PASTILLE_STATUT[signalement.statut]} {LABEL_STATUT[signalement.statut]} · {formaterDate(signalement.createdAt)}
                  </p>
                </div>
                {estOuvert ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {estOuvert && (
                <div className="px-4 pb-4 pt-1 border-t border-encre-urbaine/10 dark:border-beton/10">
                  <p className="text-sm mb-3">{signalement.description}</p>
                  <HistoriqueStatut historique={signalement.historiqueStatuts} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}