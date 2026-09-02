import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  erreur?: string;
}

export const ChampTexte = forwardRef<HTMLInputElement, Props>(function ChampTexte(
  { label, erreur, type, id, ...props },
  ref
) {
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);
  const estMotDePasse = type === 'password';
  const typeReel = estMotDePasse ? (motDePasseVisible ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={id}
          type={typeReel}
          className={`w-full min-h-[46px] px-3.5 ${estMotDePasse ? 'pr-11' : ''} rounded-lg bg-transparent border transition-colors focus:outline-none focus:ring-2 ${
            erreur
              ? 'border-signal-erreur focus:ring-signal-erreur/30'
              : 'border-encre-urbaine/25 dark:border-beton/25 focus:ring-encre-urbaine/20 dark:focus:ring-beton/20'
          }`}
        />
        {estMotDePasse && (
          <button
            type="button"
            onClick={() => setMotDePasseVisible((v) => !v)}
            tabIndex={-1}
            aria-label={motDePasseVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            className="absolute right-0 top-0 h-full w-11 flex items-center justify-center opacity-60 hover:opacity-100"
          >
            {motDePasseVisible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {erreur && (
        <p className="flex items-center gap-1.5 text-xs text-signal-erreur mt-1.5">
          <AlertCircle size={13} />
          {erreur}
        </p>
      )}
    </div>
  );
});