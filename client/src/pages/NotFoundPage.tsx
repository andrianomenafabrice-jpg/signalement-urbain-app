import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPinOff } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-beton dark:bg-bitume text-center">
      <Helmet>
        <title>Page introuvable — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative mb-6"
      >
        <span
          className="block w-20 h-20 bg-marquage-voirie opacity-40"
          style={{ borderRadius: '58% 42% 48% 52% / 45% 55% 45% 55%' }}
        />
        <MapPinOff size={30} className="absolute inset-0 m-auto text-encre-urbaine dark:text-beton" />
      </motion.div>

      <p className="font-mono text-sm opacity-50 mb-2">Erreur 404</p>
      <h1 className="text-2xl font-display font-bold mb-3">Cette rue n'existe pas sur la carte</h1>
      <p className="text-sm opacity-70 max-w-xs mb-8">
        La page que tu cherches a peut-etre ete deplacee ou n'a jamais existe.
      </p>

      <Link
        to="/"
        className="min-h-[46px] px-6 rounded-lg bg-encre-urbaine text-beton dark:bg-beton dark:text-bitume font-medium flex items-center"
      >
        Retourner a la carte
      </Link>
    </div>
  );
}