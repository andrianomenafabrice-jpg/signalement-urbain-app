import type { EntreeHistorique, Statut } from '../../types/report';

const PASTILLE: Record<Statut, string> = {
  signale: '○',
  en_cours: '◐',
  resolu: '●',
};

const LABEL: Record<Statut, string> = {
  signale: 'Signale',
  en_cours: 'Pris en charge',
  resolu: 'Resolu',
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
    <ol className="space-y-3">
      {historique.map((entree, index) => (
        <li key={`${entree.statut}-${entree.date}-${index}`} className="flex gap-3">
          <span className="font-mono text-lg leading-none w-5 shrink-0">{PASTILLE[entree.statut]}</span>
          <div>
            <p className="text-sm font-medium">{LABEL[entree.statut]}</p>
            <p className="font-mono text-xs tabular-nums opacity-70">{formaterDate(entree.date)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}