import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useSignalements } from '../../hooks/useReports';
import { MarkerMarquage } from './MarkerMarquage';
import type { Categorie } from '../../types/report';

const CENTRE_PAR_DEFAUT: [number, number] = [-18.8792, 47.5079];

function creerIconeCluster(cluster: { getChildCount: () => number }) {
  return L.divIcon({
    html: `<div class="cluster-marquage">${cluster.getChildCount()}</div>`,
    className: 'icone-marquage-conteneur',
    iconSize: L.point(40, 40, true),
  });
}

interface Props {
  categorieActive: Categorie | null;
}

export function CarteSignalements({ categorieActive }: Props) {
  const { data: signalements, isLoading, isError } = useSignalements({ categorie: categorieActive });

  return (
    <div className="relative w-full h-full">
      <MapContainer center={CENTRE_PAR_DEFAUT} zoom={13} className="w-full h-full" zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MarkerClusterGroup iconCreateFunction={creerIconeCluster} chunkedLoading>
          {signalements?.map((signalement) => (
            <MarkerMarquage key={signalement._id} signalement={signalement} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-encre-urbaine text-beton text-xs font-mono">
            Chargement des signalements…
          </span>
        </div>
      )}

      {isError && (
        <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-marquage-voirie text-beton text-xs">
            Impossible de charger la carte, reessaie plus tard.
          </span>
        </div>
      )}

      {!isLoading && !isError && signalements?.length === 0 && (
        <div className="absolute inset-x-0 bottom-24 flex justify-center pointer-events-none px-4">
          <span className="px-4 py-2 rounded-lg bg-beton dark:bg-bitume border border-encre-urbaine/20 text-sm text-center">
            Aucun signalement ici pour l'instant — sois le premier a en creer un.
          </span>
        </div>
      )}
    </div>
  );
}