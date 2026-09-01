import type { Statut } from '../types/report';

const TRANSITIONS_AUTORISEES: Record<Statut, Statut[]> = {
  signale: ['en_cours', 'resolu'],
  en_cours: ['resolu', 'signale'],
  resolu: ['en_cours'],
};

export function transitionsPossibles(statutActuel: Statut): Statut[] {
  return TRANSITIONS_AUTORISEES[statutActuel] ?? [];
}