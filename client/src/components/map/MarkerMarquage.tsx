import { Marker, Popup } from 'react-leaflet';
import type { Signalement } from '../../types/report';
import { creerIconeMarquage } from '../../lib/markerIcon';
import { getCategorie } from '../../lib/categories';

const PASTILLE_STATUT: Record<Signalement['statut'], string> = {
  signale: '○',
  en_cours: '◐',
  resolu: '●',
};

const LABEL_STATUT: Record<Signalement['statut'], string> = {
  signale: 'Signale',
  en_cours: 'En cours',
  resolu: 'Resolu',
};

interface Props {
  signalement: Signalement;
}

export function MarkerMarquage({ signalement }: Props) {
  const [longitude, latitude] = signalement.location.coordinates;
  const meta = getCategorie(signalement.categorie);
  const icone = creerIconeMarquage(signalement._id, signalement.categorie, signalement.statut);

  return (
    <Marker position={[latitude, longitude]} icon={icone}>
      <Popup minWidth={220}>
        <div className="font-body">
          {signalement.photos[0] && (
            <img
              src={signalement.photos[0]}
              alt={signalement.titre}
              className="w-full h-28 object-cover rounded-md mb-2.5"
            />
          )}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${meta.couleur}`} />
            <span className="text-xs font-medium opacity-70">{meta.label}</span>
          </div>
          <h3 className="font-display font-bold text-[15px] leading-snug mb-1.5">{signalement.titre}</h3>
          <p className="text-sm opacity-80 mb-2.5">{signalement.description}</p>
          <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums px-2 py-1 rounded-full bg-encre-urbaine/8">
            {PASTILLE_STATUT[signalement.statut]} {LABEL_STATUT[signalement.statut]}
          </span>
        </div>
      </Popup>
    </Marker>
  );
}