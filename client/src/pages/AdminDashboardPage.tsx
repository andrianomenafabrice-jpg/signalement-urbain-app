import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ListChecks, Clock, CircleDot, CheckCircle2 } from 'lucide-react';
import { useStatistiques } from '../hooks/useAdmin';
import { CarteStatistique } from '../components/dashboard/CarteStatistique';
import { RepartitionCategories } from '../components/dashboard/RepartitionCategories';
import { ListeAdmin } from '../components/dashboard/ListeAdmin';
import { Squelette } from '../components/ui/Squelette';

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

      <header className="px-4 py-3 flex items-center gap-3 border-b border-encre-urbaine/10 dark:border-beton/10">
        <Link
          to="/"
          aria-label="Retour a la carte"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-encre-urbaine/5 dark:hover:bg-beton/5 transition-colors"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-xl font-display font-bold">Tableau de bord</h1>
      </header>

      <div className="px-4 py-6 space-y-8 max-w-3xl mx-auto">
        {isError && <p className="text-sm text-signal-erreur">Impossible de charger les statistiques.</p>}

        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-encre-urbaine/12 dark:border-beton/12 p-4 space-y-2">
                <Squelette className="h-3 w-20" />
                <Squelette className="h-6 w-14" />
              </div>
            ))}
          </div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <CarteStatistique label="Total signalements" valeur={String(stats.totalSignalements)} icone={ListChecks} />
              <CarteStatistique label="Temps moyen de resolution" valeur={formaterDuree(stats.tempsMoyenResolutionHeures)} icone={Clock} />
              <CarteStatistique label="Signales" valeur={String(stats.parStatut.signale ?? 0)} icone={CircleDot} accent="text-marquage-voirie" />
              <CarteStatistique label="Resolus" valeur={String(stats.parStatut.resolu ?? 0)} icone={CheckCircle2} accent="text-signal-succes" />
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