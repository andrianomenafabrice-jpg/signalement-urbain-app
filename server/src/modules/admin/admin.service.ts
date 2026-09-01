import Report from '../../models/Report';

export interface StatistiquesGlobales {
  totalSignalements: number;
  parCategorie: Record<string, number>;
  parStatut: Record<string, number>;
  tempsMoyenResolutionHeures: number | null;
}

export async function obtenirStatistiques(): Promise<StatistiquesGlobales> {
  const [totalSignalements, statsCategorie, statsStatut, resolution] = await Promise.all([
    Report.countDocuments(),
    Report.aggregate([{ $group: { _id: '$categorie', total: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$statut', total: { $sum: 1 } } }]),
    Report.aggregate([
      { $match: { statut: 'resolu' } },
      {
        $project: {
          dateSignale: { $arrayElemAt: ['$historiqueStatuts.date', 0] },
          dateResolution: {
            $max: {
              $map: {
                input: {
                  $filter: {
                    input: '$historiqueStatuts',
                    as: 'h',
                    cond: { $eq: ['$$h.statut', 'resolu'] },
                  },
                },
                as: 'h2',
                in: '$$h2.date',
              },
            },
          },
        },
      },
      {
        $project: {
          dureeHeures: {
            $divide: [{ $subtract: ['$dateResolution', '$dateSignale'] }, 1000 * 60 * 60],
          },
        },
      },
      { $group: { _id: null, moyenne: { $avg: '$dureeHeures' } } },
    ]),
  ]);

  const parCategorie: Record<string, number> = {};
  for (const entree of statsCategorie) {
    parCategorie[entree._id] = entree.total;
  }

  const parStatut: Record<string, number> = {};
  for (const entree of statsStatut) {
    parStatut[entree._id] = entree.total;
  }

  return {
    totalSignalements,
    parCategorie,
    parStatut,
    tempsMoyenResolutionHeures: resolution[0]?.moyenne ?? null,
  };
}