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
  const urlBase = (import.meta.env.VITE_API_URL as string).replace(/\/api\/?$/, '');

  return (
    <Marker position={[latitude, longitude]} icon={icone}>
      <Popup>
        <div className="font-body min-w-[200px]">
          {signalement.photos[0] && (
            <img
              src={`${urlBase}${signalement.photos[0]}`}
              alt={signalement.titre}
              className="w-full h-24 object-cover rounded mb-2"
            />
          )}
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-3 h-3 rounded-full ${meta.couleur}`} />
            <span className="text-sm font-medium">{meta.label}</span>
          </div>
          <h3 className="font-display font-bold text-base mb-1">{signalement.titre}</h3>
          <p className="text-sm mb-2">{signalement.description}</p>
          <p className="font-mono text-xs tabular-nums">
            {PASTILLE_STATUT[signalement.statut]} {LABEL_STATUT[signalement.statut]}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}