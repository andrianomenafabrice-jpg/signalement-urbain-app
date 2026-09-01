import L from 'leaflet';
import type { Categorie, Statut } from '../types/report';
import { getCategorie } from './categories';

function irregulariteDepuisId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  }
  const a = 55 + (hash % 15);
  const b = 100 - a;
  const c = 45 + ((hash >> 3) % 15);
  const d = 100 - c;
  return `${a}% ${b}% ${c}% ${d}% / ${c}% ${d}% ${a}% ${b}%`;
}

export function creerIconeMarquage(id: string, categorie: Categorie, statut: Statut): L.DivIcon {
  const meta = getCategorie(categorie);
  const borderRadius = irregulariteDepuisId(id);
  const estResolu = statut === 'resolu';

  const html = `
    <div class="marqueur-peinture" style="
      background-color: ${meta.hex};
      border-radius: ${borderRadius};
      opacity: ${estResolu ? 0.45 : 1};
      filter: ${estResolu ? 'blur(0.4px)' : 'none'};
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'icone-marquage-conteneur',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}