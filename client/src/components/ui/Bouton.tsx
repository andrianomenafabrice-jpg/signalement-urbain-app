import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  chargement?: boolean;
  variante?: 'primaire' | 'discret';
  children: ReactNode;
}

export function Bouton({
  chargement,
  variante = 'primaire',
  disabled,
  children,
  className = '',
  ...props
}: Props) {
  const base =
    'min-h-[48px] px-5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100';
  const styles =
    variante === 'primaire'
      ? 'bg-encre-urbaine text-beton dark:bg-beton dark:text-bitume'
      : 'border border-encre-urbaine/30 dark:border-beton/30';

  return (
    <button {...props} disabled={disabled || chargement} className={`${base} ${styles} ${className}`}>
      {chargement && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}