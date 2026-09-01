import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { CartePage } from './pages/CartePage';
import { ConnexionPage } from './pages/ConnexionPage';
import { InscriptionPage } from './pages/InscriptionPage';
import { MesSignalementsPage } from './pages/MesSignalementsPage';
import { RoutePrivee } from './components/ui/RoutePrivee';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CartePage />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/inscription" element={<InscriptionPage />} />
            <Route
              path="/mes-signalements"
              element={
                <RoutePrivee>
                  <MesSignalementsPage />
                </RoutePrivee>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;