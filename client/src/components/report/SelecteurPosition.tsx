import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const iconePlacement = L.divIcon({
  html: '<div class="marqueur-placement"></div>',
  className: 'icone-marquage-conteneur',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

interface Props {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
}

function GestionClic({ onChange }: { onChange: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecentrageAuto({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);
  return null;
}

export function SelecteurPosition({ latitude, longitude, onChange }: Props) {
  return (
    <div className="h-48 rounded-lg overflow-hidden border border-encre-urbaine/20">
      <MapContainer center={[latitude, longitude]} zoom={16} className="w-full h-full" scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]} icon={iconePlacement} />
        <GestionClic onChange={onChange} />
        <RecentrageAuto latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}