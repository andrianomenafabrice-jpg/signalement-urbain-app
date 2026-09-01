import { peutTransitionner, appliquerTransition, EtatSignalement } from '../../services/statut.service';

describe('peutTransitionner', () => {
  const casAutorises: Array<[string, string]> = [
    ['signale', 'en_cours'],
    ['en_cours', 'resolu'],
    ['en_cours', 'signale'],
    ['resolu', 'en_cours'],
    ['signale', 'resolu'],
  ];

  it.each(casAutorises)('autorise %s -> %s', (actuel, nouveau) => {
    expect(peutTransitionner(actuel as any, nouveau as any)).toBe(true);
  });

  it('refuse resolu -> signale', () => {
    expect(peutTransitionner('resolu', 'signale')).toBe(false);
  });

  it('refuse une transition vers le meme statut', () => {
    expect(peutTransitionner('signale', 'signale')).toBe(false);
    expect(peutTransitionner('en_cours', 'en_cours')).toBe(false);
    expect(peutTransitionner('resolu', 'resolu')).toBe(false);
  });

  it('refuse un statut inconnu (garde-fou defensif)', () => {
    expect(peutTransitionner('inexistant' as any, 'signale')).toBe(false);
  });
});

describe('appliquerTransition', () => {
  const parId = '6a963021e446370cce5b84e7';

  it("ajoute une entree d'historique avec le bon parId et un timestamp lors d'une transition reussie", () => {
    const etatInitial: EtatSignalement = { statut: 'signale', historiqueStatuts: [] };
    const date = new Date('2026-09-01T10:00:00Z');

    const resultat = appliquerTransition(etatInitial, 'en_cours', parId, date);

    expect(resultat.succes).toBe(true);
    expect(resultat.etat.statut).toBe('en_cours');
    expect(resultat.etat.historiqueStatuts).toHaveLength(1);
    expect(resultat.etat.historiqueStatuts[0]).toEqual({ statut: 'en_cours', date, parId });
  });

  it('ne modifie ni le statut ni l\'historique sur une transition invalide (pas de modification partielle)', () => {
    const etatInitial: EtatSignalement = {
      statut: 'resolu',
      historiqueStatuts: [{ statut: 'resolu', date: new Date('2026-08-01'), parId }],
    };

    const resultat = appliquerTransition(etatInitial, 'signale', parId);

    expect(resultat.succes).toBe(false);
    expect(resultat.erreur).toBeDefined();
    expect(resultat.etat).toBe(etatInitial);
    expect(resultat.etat.statut).toBe('resolu');
    expect(resultat.etat.historiqueStatuts).toHaveLength(1);
  });

  it('accumule plusieurs transitions sans alterer les entrees precedentes', () => {
    let etat: EtatSignalement = { statut: 'signale', historiqueStatuts: [] };

    const r1 = appliquerTransition(etat, 'en_cours', parId, new Date('2026-09-01'));
    etat = r1.etat;
    const r2 = appliquerTransition(etat, 'resolu', parId, new Date('2026-09-05'));
    etat = r2.etat;

    expect(etat.historiqueStatuts).toHaveLength(2);
    expect(etat.historiqueStatuts.map((e) => e.statut)).toEqual(['en_cours', 'resolu']);
  });
});