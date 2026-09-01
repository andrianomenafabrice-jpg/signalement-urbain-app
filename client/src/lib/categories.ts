import { Construction, Lightbulb, Trash2, Droplet, CircleDot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Categorie } from '../types/report';

interface MetaCategorie {
  id: Categorie;
  label: string;
  couleur: string;
  hex: string;
  icone: LucideIcon;
}

export const CATEGORIES: MetaCategorie[] = [
  { id: 'voirie', label: 'Voirie', couleur: 'bg-marquage-voirie', hex: 'var(--marquage-voirie)', icone: Construction },
  { id: 'eclairage', label: 'Eclairage', couleur: 'bg-marquage-eclairage', hex: 'var(--marquage-eclairage)', icone: Lightbulb },
  { id: 'dechets', label: 'Dechets', couleur: 'bg-marquage-dechets', hex: 'var(--marquage-dechets)', icone: Trash2 },
  { id: 'eau', label: 'Eau', couleur: 'bg-marquage-eau', hex: 'var(--marquage-eau)', icone: Droplet },
  { id: 'autre', label: 'Autre', couleur: 'bg-marquage-autre', hex: 'var(--marquage-autre)', icone: CircleDot },
];

export function getCategorie(id: Categorie): MetaCategorie {
  return CATEGORIES.find((c) => c.id === id)!;
}