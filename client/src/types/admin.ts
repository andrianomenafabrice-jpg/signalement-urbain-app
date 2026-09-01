export interface StatistiquesGlobales {
  totalSignalements: number;
  parCategorie: Record<string, number>;
  parStatut: Record<string, number>;
  tempsMoyenResolutionHeures: number | null;
}