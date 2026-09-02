import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PanneauMarque } from './PanneauMarque';

interface Props {
  children: ReactNode;
}

export function MiseEnPageAuth({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-beton dark:bg-bitume">
      <PanneauMarque />

      <div className="flex-1 flex flex-col">
        <div className="p-5 lg:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft size={16} />
            Retour a la carte
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}