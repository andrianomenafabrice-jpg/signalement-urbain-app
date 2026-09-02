import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMesSignalements } from '../hooks/useReports';
import { getCategorie } from '../lib/categories';
import { HistoriqueStatut } from '../components/report/HistoriqueStatut';
import { Squelette } from '../components/ui/Squelette';
import type { Statut } from '../types/report';

const PASTILLE_STATUT: Record<Statut, string> = { signale: '○', en_cours: '◐', resolu: '●' };
const LABEL_STATUT: Record<Statut, string> = { signale: 'Signale', en_cours: 'En cours', resolu: 'Resolu' };
const COULEUR_STATUT: Record<Statut, string> = {
  signale: 'bg-marquage-voirie',
  en_cours: 'bg-marquage-eclairage',
  resolu: 'bg-signal-succes',
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

      <header className="px-4 py-3 flex items-center gap-3 border-b border-encre-urbaine/10 dark:border-beton/10">
        <Link
          to="/"
          aria-label="Retour a la carte"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-encre-urbaine/5 dark:hover:bg-beton/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-xl font-display font-bold">Mes signalements</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        <button
          type="button"
          onClick={() => setStatutActif(null)}
          className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border transition-all active:scale-[0.96] ${
            statutActif === null
              ? 'bg-encre-urbaine text-beton border-encre-urbaine dark:bg-beton dark:text-bitume'
              : 'border-encre-urbaine/25 dark:border-beton/25 hover:border-encre-urbaine/50 dark:hover:border-beton/50'
          }`}
        >
          Tout
        </button>
        {statuts.map((statut) => (
          <button
            key={statut}
            type="button"
            onClick={() => setStatutActif(statutActif === statut ? null : statut)}
            className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-medium border flex items-center gap-2 transition-all active:scale-[0.96] ${
              statutActif === statut
                ? 'bg-encre-urbaine text-beton border-encre-urbaine dark:bg-beton dark:text-bitume'
                : 'border-encre-urbaine/25 dark:border-beton/25 hover:border-encre-urbaine/50 dark:hover:border-beton/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${statutActif === statut ? 'bg-beton dark:bg-bitume' : COULEUR_STATUT[statut]}`} />
            {LABEL_STATUT[statut]}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8 space-y-3 max-w-2xl mx-auto">
        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-encre-urbaine/10 dark:border-beton/10">
                <Squelette className="w-14 h-14 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Squelette className="h-3 w-16" />
                  <Squelette className="h-4 w-2/3" />
                  <Squelette className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && <p className="text-sm text-signal-erreur">Impossible de charger tes signalements.</p>}

        {!isLoading && !isError && signalements?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm opacity-60 mb-4">Tu n'as encore rien signale.</p>
            <Link to="/" className="underline text-sm font-medium">Retourner a la carte</Link>
          </div>
        )}

        {signalements?.map((signalement) => {
          const meta = getCategorie(signalement.categorie);
          const estOuvert = ouvert === signalement._id;

          return (
            <div
              key={signalement._id}
              className="rounded-lg border border-encre-urbaine/10 dark:border-beton/10 overflow-hidden hover:border-encre-urbaine/20 dark:hover:border-beton/20 transition-colors"
            >
              <button
                type="button"
                onClick={() => setOuvert(estOuvert ? null : signalement._id)}
                className="w-full flex items-center gap-3 p-3 text-left min-h-[68px]"
              >
                {signalement.photos[0] ? (
                  <img
                    src={`${urlBase}${signalement.photos[0]}`}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center bg-encre-urbaine/5 dark:bg-beton/5">
                    <MapPin size={18} className="opacity-40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${meta.couleur}`} />
                    <span className="text-xs opacity-60">{meta.label}</span>
                  </div>
                  <p className="font-medium truncate">{signalement.titre}</p>
                  <p className="font-mono text-xs tabular-nums opacity-60">
                    {PASTILLE_STATUT[signalement.statut]} {LABEL_STATUT[signalement.statut]} · {formaterDate(signalement.createdAt)}
                  </p>
                </div>
                <motion.span animate={{ rotate: estOuvert ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} className="opacity-60" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {estOuvert && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-encre-urbaine/10 dark:border-beton/10">
                      <p className="text-sm opacity-80 mb-4">{signalement.description}</p>
                      <HistoriqueStatut historique={signalement.historiqueStatuts} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}