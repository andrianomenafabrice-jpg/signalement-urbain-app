import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStatistiques } from '../hooks/useAdmin';
import { CarteStatistique } from '../components/dashboard/CarteStatistique';
import { RepartitionCategories } from '../components/dashboard/RepartitionCategories';
import { ListeAdmin } from '../components/dashboard/ListeAdmin';

function formaterDuree(heures: number | null): string {
  if (heures === null) return '—';
  if (heures < 24) return `${Math.round(heures)} h`;
  return `${(heures / 24).toFixed(1)} j`;
}

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useStatistiques();

  return (
    <div className="min-h-screen bg-beton dark:bg-bitume">
      <Helmet>
        <title>Tableau de bord — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="px-4 py-3 flex items-center gap-3 border-b border-encre-urbaine/10">
        <Link to="/" aria-label="Retour a la carte" className="min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-xl font-display font-bold">Tableau de bord</h1>
      </header>

      <div className="px-4 py-5 space-y-8 max-w-3xl mx-auto">
        {isLoading && <p className="text-sm opacity-70">Chargement des statistiques…</p>}
        {isError && <p className="text-sm text-marquage-voirie">Impossible de charger les statistiques.</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <CarteStatistique label="Total signalements" valeur={String(stats.totalSignalements)} />
              <CarteStatistique label="Temps moyen de resolution" valeur={formaterDuree(stats.tempsMoyenResolutionHeures)} />
              <CarteStatistique label="Signales" valeur={String(stats.parStatut.signale ?? 0)} />
              <CarteStatistique label="Resolus" valeur={String(stats.parStatut.resolu ?? 0)} />
            </div>

            <section>
              <h2 className="text-lg font-display font-bold mb-3">Repartition par categorie</h2>
              <RepartitionCategories parCategorie={stats.parCategorie} />
            </section>
          </>
        )}

        <section>
          <h2 className="text-lg font-display font-bold mb-3">Tous les signalements</h2>
          <ListeAdmin />
        </section>
      </div>
    </div>
  );
}