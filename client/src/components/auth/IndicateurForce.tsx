interface Props {
  motDePasse: string;
}

function calculerNiveau(motDePasse: string): number {
  if (motDePasse.length === 0) return 0;
  let niveau = 0;
  if (motDePasse.length >= 8) niveau += 1;
  if (/[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse)) niveau += 1;
  if (/\d/.test(motDePasse)) niveau += 1;
  if (/[^A-Za-z0-9]/.test(motDePasse)) niveau += 1;
  return niveau;
}

const LABELS = ['Trop court', 'Faible', 'Correct', 'Solide', 'Excellent'];
const COULEURS = ['bg-signal-erreur', 'bg-signal-erreur', 'bg-marquage-eclairage', 'bg-marquage-eau', 'bg-signal-succes'];

export function IndicateurForce({ motDePasse }: Props) {
  if (!motDePasse) return null;
  const niveau = calculerNiveau(motDePasse);

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < niveau ? COULEURS[niveau] : 'bg-encre-urbaine/10 dark:bg-beton/10'}`}
          />
        ))}
      </div>
      <p className="text-xs opacity-60 mt-1">{LABELS[niveau]}</p>
    </div>
  );
}