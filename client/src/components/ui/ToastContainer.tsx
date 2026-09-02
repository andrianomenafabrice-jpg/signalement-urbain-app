import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export function ToastContainer() {
  const toasts = useToastStore((etat) => etat.toasts);
  const retirer = useToastStore((etat) => etat.retirer);

  return (
    <div className="fixed top-4 inset-x-0 z-[2000] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const estSucces = t.type === 'succes';
          const Icone = estSucces ? CheckCircle2 : XCircle;
          const couleurBarre = estSucces ? 'bg-signal-succes' : 'bg-signal-erreur';
          const couleurTexte = estSucces ? 'text-signal-succes' : 'text-signal-erreur';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="pointer-events-auto w-full max-w-sm bg-beton dark:bg-bitume shadow-lg overflow-hidden relative"
              style={{ borderRadius: '4px 16px 4px 16px' }}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${couleurBarre}`} />
              <div className="flex items-start gap-3 pl-4 pr-3 py-3">
                <Icone size={20} className={`${couleurTexte} shrink-0 mt-0.5`} />
                <p className="text-sm flex-1">{t.message}</p>
                <button
                  type="button"
                  onClick={() => retirer(t.id)}
                  aria-label="Fermer la notification"
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`h-0.5 origin-left ${couleurBarre}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}