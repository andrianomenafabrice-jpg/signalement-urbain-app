const BLOBS = [
  { couleur: 'var(--marquage-voirie)', top: '18%', left: '22%', taille: 64, radius: '62% 38% 55% 45% / 48% 52% 48% 52%' },
  { couleur: 'var(--marquage-eau)', top: '58%', left: '12%', taille: 44, radius: '55% 45% 60% 40% / 40% 55% 45% 60%' },
  { couleur: 'var(--marquage-eclairage)', top: '30%', left: '68%', taille: 52, radius: '48% 52% 42% 58% / 58% 42% 58% 42%' },
  { couleur: 'var(--marquage-dechets)', top: '72%', left: '60%', taille: 38, radius: '58% 42% 48% 52% / 45% 55% 45% 55%' },
  { couleur: 'var(--marquage-autre)', top: '48%', left: '82%', taille: 30, radius: '50% 50% 62% 38% / 55% 45% 55% 45%' },
];

export function PanneauMarque() {
  return (
    <div className="hidden lg:flex lg:w-[42%] relative bg-bitume overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none" viewBox="0 0 400 800">
        <path d="M0,120 L400,60" stroke="#EEEAE2" strokeWidth="2" />
        <path d="M0,340 L400,420" stroke="#EEEAE2" strokeWidth="2" />
        <path d="M0,600 L400,540" stroke="#EEEAE2" strokeWidth="2" />
        <path d="M80,0 L140,800" stroke="#EEEAE2" strokeWidth="2" />
        <path d="M320,0 L260,800" stroke="#EEEAE2" strokeWidth="2" />
      </svg>

      {BLOBS.map((blob, index) => (
        <span
          key={index}
          className="absolute"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.taille,
            height: blob.taille,
            backgroundColor: blob.couleur,
            borderRadius: blob.radius,
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col justify-end p-12 text-beton">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Plateforme citoyenne</p>
        <h2 className="text-4xl font-display font-bold leading-tight mb-3">
          Chaque rue<br />merite d'etre<br />entendue.
        </h2>
        <p className="text-sm opacity-70 max-w-xs">
          Signale, suis et vois resolus les problemes de voirie, eclairage, dechets et eau pres de chez toi.
        </p>
      </div>
    </div>
  );
}