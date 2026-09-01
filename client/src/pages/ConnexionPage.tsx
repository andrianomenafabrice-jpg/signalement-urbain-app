import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export function ConnexionPage() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const setSession = useAuthStore((etat) => etat.setSession);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setErreur(null);
    setChargement(true);
    try {
      const { data } = await api.post('/auth/login', { email, motDePasse });
      setSession(data.user, data.accessToken);
      navigate('/');
    } catch (err: any) {
      setErreur(err.response?.data?.error?.message ?? 'Connexion impossible.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-beton dark:bg-bitume">
      <Helmet>
        <title>Connexion — SignalUrbain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-display font-bold mb-2">Connexion</h1>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-lg border border-encre-urbaine/30 dark:border-beton/30 bg-transparent"
          />
        </div>

        {erreur && <p className="text-sm text-marquage-voirie">{erreur}</p>}

        <button
          type="submit"
          disabled={chargement}
          className="w-full min-h-[48px] rounded-lg bg-encre-urbaine text-beton dark:bg-beton dark:text-bitume font-medium disabled:opacity-50"
        >
          {chargement ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="text-sm text-center">
          Pas de compte ? <Link to="/inscription" className="underline">Inscris-toi</Link>
        </p>
      </form>
    </div>
  );
}