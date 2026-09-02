import type { EntreeHistorique, Statut } from '../../types/report';

const LABEL: Record<Statut, string> = {
  signale: 'Signale',
  en_cours: 'Pris en charge',
  resolu: 'Resolu',
};

const COULEUR: Record<Statut, string> = {
  signale: 'bg-marquage-voirie',
  en_cours: 'bg-marquage-eclairage',
  resolu: 'bg-signal-succes',
};

function formaterDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  historique: EntreeHistorique[];
}

export function HistoriqueStatut({ historique }: Props) {
  return (
    <ol className="relative">
      {historique.map((entree, index) => {
        const dernier = index === historique.length - 1;
        return (
          <li key={`${entree.statut}-${entree.date}-${index}`} className="relative pl-7 pb-5 last:pb-0">
            {!dernier && (
              <span className="absolute left-[7px] top-4 bottom-0 w-px bg-encre-urbaine/15 dark:bg-beton/15" />
            )}
            <span
              className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full ${COULEUR[entree.statut]} ring-4 ring-beton dark:ring-bitume`}
            />
            <p className="text-sm font-medium leading-tight">{LABEL[entree.statut]}</p>
            <p className="font-mono text-xs tabular-nums opacity-60 mt-0.5">{formaterDate(entree.date)}</p>
          </li>
        );
      })}
    </ol>
  );
}