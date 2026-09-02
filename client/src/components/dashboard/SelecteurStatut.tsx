import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { transitionsPossibles } from '../../lib/statutTransitions';
import type { Statut } from '../../types/report';

const LABEL_STATUT: Record<Statut, string> = {
  signale: 'Signale',
  en_cours: 'En cours',
  resolu: 'Resolu',
};

const PASTILLE_STATUT: Record<Statut, string> = {
  signale: '○',
  en_cours: '◐',
  resolu: '●',
};

interface Props {
  statutActuel: Statut;
  chargement: boolean;
  onChangerStatut: (statut: Statut) => void;
}

export function SelecteurStatut({ statutActuel, chargement, onChangerStatut }: Props) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOuvert(false));
  const options = transitionsPossibles(statutActuel);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        disabled={chargement || options.length === 0}
        className="min-h-[40px] px-3 rounded-lg border border-encre-urbaine/25 dark:border-beton/25 flex items-center gap-2 text-sm font-medium disabled:opacity-40 hover:border-encre-urbaine/50 dark:hover:border-beton/50 transition-colors"
      >
        {chargement ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <span className="font-mono">{PASTILLE_STATUT[statutActuel]}</span>
        )}
        {LABEL_STATUT[statutActuel]}
        {options.length > 0 && (
          <ChevronDown size={14} className={`transition-transform ${ouvert ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {ouvert && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-lg bg-beton dark:bg-bitume shadow-lg border border-encre-urbaine/10 dark:border-beton/10 overflow-hidden"
          >
            {options.map((statut) => (
              <button
                key={statut}
                type="button"
                onClick={() => {
                  onChangerStatut(statut);
                  setOuvert(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-encre-urbaine/5 dark:hover:bg-beton/5 transition-colors"
              >
                <span className="font-mono">{PASTILLE_STATUT[statut]}</span>
                {LABEL_STATUT[statut]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}