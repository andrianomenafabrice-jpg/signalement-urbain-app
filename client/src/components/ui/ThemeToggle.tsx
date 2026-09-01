import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function lireThemeInitial(): boolean {
  const stocke = localStorage.getItem('theme');
  if (stocke) return stocke === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggle() {
  const [sombre, setSombre] = useState(lireThemeInitial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', sombre);
    localStorage.setItem('theme', sombre ? 'dark' : 'light');
  }, [sombre]);

  return (
    <button
      type="button"
      onClick={() => setSombre((v) => !v)}
      aria-label={sombre ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-encre-urbaine/20 dark:border-beton/20"
    >
      {sombre ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}