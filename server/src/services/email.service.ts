import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { IReport } from '../models/Report';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

const LABEL_STATUT: Record<string, string> = {
  signale: 'Signale',
  en_cours: 'Pris en charge',
  resolu: 'Resolu',
};

interface EnvoiNotificationParams {
  destinataireEmail: string;
  destinataireNom: string;
  report: IReport;
}

export async function envoyerEmailChangementStatut({
  destinataireEmail,
  destinataireNom,
  report,
}: EnvoiNotificationParams): Promise<void> {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('SMTP non configure, notification email ignoree.');
    return;
  }

  const label = LABEL_STATUT[report.statut] ?? report.statut;

  await transporter.sendMail({
    from: env.EMAIL_FROM || 'noreply@signalurbain.test',
    to: destinataireEmail,
    subject: `Ton signalement "${report.titre}" est maintenant "${label}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1A1917;">
        <h2 style="margin-bottom: 4px;">Bonjour ${destinataireNom},</h2>
        <p>Le statut de ton signalement a change :</p>
        <p style="font-size: 18px; margin: 16px 0 4px;"><strong>${report.titre}</strong></p>
        <p style="margin-top: 0;">Nouveau statut : <strong>${label}</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 13px;">SignalUrbain — plateforme citoyenne de signalement de problemes urbains.</p>
      </div>
    `,
  });
}

export function fermerTransporteurEmail(): void {
  transporter.close();
}