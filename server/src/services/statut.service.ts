export type Statut = 'signale' | 'en_cours' | 'resolu';

export interface EntreeHistorique {
  statut: Statut;
  date: Date;
  parId: string;
}

export interface EtatSignalement {
  statut: Statut;
  historiqueStatuts: EntreeHistorique[];
}

export interface ResultatTransition {
  succes: boolean;
  etat: EtatSignalement;
  erreur?: string;
}

const TRANSITIONS_AUTORISEES: Record<Statut, Statut[]> = {
  signale: ['en_cours', 'resolu'],
  en_cours: ['resolu', 'signale'],
  resolu: ['en_cours'],
};

export function peutTransitionner(statutActuel: Statut, nouveauStatut: Statut): boolean {
  return TRANSITIONS_AUTORISEES[statutActuel]?.includes(nouveauStatut) ?? false;
}

export function appliquerTransition(
  etatActuel: EtatSignalement,
  nouveauStatut: Statut,
  parId: string,
  date: Date = new Date()
): ResultatTransition {
  if (!peutTransitionner(etatActuel.statut, nouveauStatut)) {
    return {
      succes: false,
      etat: etatActuel,
      erreur: `Transition de "${etatActuel.statut}" vers "${nouveauStatut}" non autorisee.`,
    };
  }

  const nouvelleEntree: EntreeHistorique = { statut: nouveauStatut, date, parId };

  return {
    succes: true,
    etat: {
      statut: nouveauStatut,
      historiqueStatuts: [...etatActuel.historiqueStatuts, nouvelleEntree],
    },
  };
}