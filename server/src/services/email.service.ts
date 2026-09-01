import { IReport } from '../models/Report';

// Implementation Nodemailer complete en Phase 7. Le point d'integration
// est deja cable dans le flux de changement de statut (section 5) pour
// ne pas avoir a retoucher report.service.ts plus tard.
export async function envoyerEmailChangementStatut(report: IReport): Promise<void> {
  console.log(
    `[email] Notification a envoyer pour le signalement ${report.id} (nouveau statut : ${report.statut}).`
  );
}