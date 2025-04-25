import nodemailer from "nodemailer";
import {User} from "@prisma/client";

class EmailService {

    /**
     * @param to
     * @param subject
     * @param htmlContent
     * @private
     */
    private async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10), // valeur par défaut si vide
            secure: process.env.SMTP_SECURE === 'true', // transforme la valeur en boolean au lieu de string
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });

        try {
            await transporter.sendMail({
                from: '"SparkOtto" <sparkOtto@example.com>', // TODO Remplacer par le bon mail
                to, // Adresse du destinataire
                subject, // Sujet du mail
                html: htmlContent, // Contenu HTML du mail
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
            throw new Error('Échec de l\'envoi de l\'email.');
        }
    }

    /**
     *
     * @param user
     */
    async sendConfirmationEmail(user: User): Promise<void> {
        const subject = 'Confirmation de votre inscription';
        const htmlContent = `<p>Bonjour ${user.name},</p>
                             <p>Nous sommes heureux de vous informer que votre inscription a été validée.</p>
                             <p>Bienvenue parmi nous !</p>`;
        await this.sendEmail(user.email, subject, htmlContent);
    }

    /**
     *
     * @param user
     */
    async sendRejectionEmail(user: User): Promise<void> {
        const subject = 'Refus de votre inscription';
        const htmlContent = `<p>Bonjour ${user.name},</p>
                             <p>Nous sommes au regret de vous informer que votre inscription a été refusée.</p>
                             <p>N'hésitez pas à nous contacter pour plus d'informations.</p>`;
        await this.sendEmail(user.email, subject, htmlContent);
    }
}
export default EmailService;