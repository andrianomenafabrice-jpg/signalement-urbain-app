import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { CartePage } from './pages/CartePage';
import { ConnexionPage } from './pages/ConnexionPage';
import { InscriptionPage } from './pages/InscriptionPage';
import { MesSignalementsPage } from './pages/MesSignalementsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RoutePrivee } from './components/ui/RoutePrivee';
import { RouteAdmin } from './components/ui/RouteAdmin';
import { PageTransition } from './components/ui/PageTransition';
import { ToastContainer } from './components/ui/ToastContainer';
import { ChargementInitial } from './components/ui/ChargementInitial';
import { useInitAuth } from './hooks/useInitAuth';

function RoutesAnimees() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><CartePage /></PageTransition>} />
        <Route path="/connexion" element={<PageTransition><ConnexionPage /></PageTransition>} />
        <Route path="/inscription" element={<PageTransition><InscriptionPage /></PageTransition>} />
        <Route
          path="/mes-signalements"
          element={
            <RoutePrivee>
              <PageTransition><MesSignalementsPage /></PageTransition>
            </RoutePrivee>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteAdmin>
              <PageTransition><AdminDashboardPage /></PageTransition>
            </RouteAdmin>
          }
        />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function ContenuApp() {
  const pret = useInitAuth();

  if (!pret) {
    return <ChargementInitial />;
  }

  return (
    <>
      <ToastContainer />
      <RoutesAnimees />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ContenuApp />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;