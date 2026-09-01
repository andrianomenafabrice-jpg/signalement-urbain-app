// client/src/App.tsx
import { useEffect, useState } from 'react';

type Categorie = 'voirie' | 'eclairage' | 'dechets' | 'eau' | 'autre';

const categories: { id: Categorie; label: string; classe: string }[] = [
  { id: 'voirie', label: 'Voirie', classe: 'bg-marquage-voirie' },
  { id: 'eclairage', label: 'Eclairage', classe: 'bg-marquage-eclairage' },
  { id: 'dechets', label: 'Dechets', classe: 'bg-marquage-dechets' },
  { id: 'eau', label: 'Eau', classe: 'bg-marquage-eau' },
  { id: 'autre', label: 'Autre', classe: 'bg-marquage-autre' },
];

function App() {
  const [dark, setDark] = useState(false);
  const [apiStatus, setApiStatus] = useState<'chargement' | 'ok' | 'erreur'>('chargement');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setApiStatus(data.db === 'connecte' ? 'ok' : 'erreur'))
      .catch(() => setApiStatus('erreur'));
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-display font-bold">SignalUrbain</h1>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="px-4 py-2 rounded border border-current min-h-[44px]"
        >
          {dark ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>

      <section className="mb-10">
        <p className="font-mono text-sm">
          API :{' '}
          {apiStatus === 'chargement' && 'connexion en cours…'}
          {apiStatus === 'ok' && 'connectee a MongoDB'}
          {apiStatus === 'erreur' && 'injoignable — verifie que le serveur tourne'}
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center gap-2">
            <span className={`w-14 h-14 rounded-full ${cat.classe}`} />
            <span className="text-sm">{cat.label}</span>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;