import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CarteSignalements } from '../components/map/CarteSignalements';
import { FiltresCarte } from '../components/map/FiltresCarte';
import { FormulaireSignalement } from '../components/report/FormulaireSignalement';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuthStore } from '../store/authStore';
import type { Categorie } from '../types/report';

export function CartePage() {
  const [categorieActive, setCategorieActive] = useState<Categorie | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const utilisateur = useAuthStore((etat) => etat.user);

  function ouvrirFormulaire(): void {
    if (!utilisateur) {
      window.location.href = '/connexion';
      return;
    }
    setFormulaireOuvert(true);
  }

  return (
    <div className="flex flex-col h-screen">
      <Helmet>
        <title>SignalUrbain — Carte des signalements urbains</title>
        <meta
          name="description"
          content="Consultez et signalez les problemes de voirie, eclairage, dechets et eau pres de chez vous."
        />
      </Helmet>

      <header className="px-4 py-3 flex items-center justify-between bg-beton dark:bg-bitume border-b border-encre-urbaine/10">
        <h1 className="text-xl font-display font-bold">SignalUrbain</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {utilisateur ? (
            <span className="text-sm font-mono hidden sm:inline">{utilisateur.nom}</span>
          ) : (
            <Link to="/connexion" className="text-sm underline">Connexion</Link>
          )}
        </div>
      </header>

      <FiltresCarte categorieActive={categorieActive} onChange={setCategorieActive} />

      <div className="relative flex-1">
        <CarteSignalements categorieActive={categorieActive} />

        <button
          type="button"
          onClick={ouvrirFormulaire}
          className="absolute bottom-6 right-4 z-[900] min-h-[52px] pl-4 pr-5 rounded-full bg-encre-urbaine text-beton dark:bg-beton dark:text-bitume font-medium flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Signaler
        </button>
      </div>

      <AnimatePresence>
        {formulaireOuvert && (
          <FormulaireSignalement
            onFerme={() => setFormulaireOuvert(false)}
            onCree={() => setFormulaireOuvert(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}