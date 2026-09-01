export type Categorie = 'voirie' | 'eclairage' | 'dechets' | 'eau' | 'autre';
export type Statut = 'signale' | 'en_cours' | 'resolu';

export interface EntreeHistorique {
  statut: Statut;
  date: string;
  parId: string;
}

export interface Signalement {
  _id: string;
  titre: string;
  description: string;
  categorie: Categorie;
  location: { type: 'Point'; coordinates: [number, number] };
  photos: string[];
  statut: Statut;
  historiqueStatuts: EntreeHistorique[];
  auteurId: string;
  createdAt: string;
}

export interface ReponsePaginee<T> {
  donnees: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}