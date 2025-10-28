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
        if (!to || to.trim() === "" || !await this.isValidEmail(to)) {
            throw new Error("L'adresse email du destinataire est invalide.");
        }

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
                from: process.env.SMTP_USER,
                to, // Adresse du destinataire
                subject, // Sujet du mail
                html: htmlContent, // Contenu HTML du mail
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email");
            throw new Error('Échec de l\'envoi de l\'email.');
        }
    }

    /**
     *
     * @param user
     */
    async sendConfirmationEmail(user: User): Promise<void> {
        const subject = 'Confirmation de votre inscription';
        const htmlContent = `<p>Bonjour ${user.first_name},</p>
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
        const htmlContent = `<p>Bonjour ${user.first_name},</p>
                             <p>Nous sommes au regret de vous informer que votre inscription a été refusée.</p>
                             <p>N'hésitez pas à nous contacter pour plus d'informations.</p>`;
        await this.sendEmail(user.email, subject, htmlContent);
    }

    async isValidEmail(email: string): Promise<boolean> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Envoie un email de réinitialisation de mot de passe
     */
    async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        const subject = 'Réinitialisation de votre mot de passe - SparkOtto';
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
                
                <p>Bonjour ${firstName},</p>
                
                <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte SparkOtto.</p>
                
                <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    Ce lien est valide pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
                    ignorez cet email.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br>
                    ${resetUrl}
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                    SparkOtto - Service de partage de véhicules
                </p>
            </div>
        `;

        await this.sendEmail(email, subject, htmlContent);
    }

    /**
     * Envoie un email de notification de blocage de compte
     */
    async sendAccountLockedEmail(email: string, firstName: string): Promise<void> {
        const subject = 'Compte temporairement verrouillé - SparkOtto';
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Compte temporairement verrouillé</h2>
                
                <p>Bonjour ${firstName},</p>
                
                <p>Votre compte SparkOtto a été temporairement verrouillé suite à plusieurs tentatives de connexion infructueuses.</p>
                
                <p><strong>Durée du verrouillage :</strong> 15 minutes</p>
                
                <p>Si vous avez oublié votre mot de passe, vous pouvez demander une réinitialisation sur la page de connexion.</p>
                
                <p style="color: #666; font-size: 14px;">
                    Si vous pensez que cette action est suspecte, contactez immédiatement notre support.
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                    SparkOtto - Service de partage de véhicules
                </p>
            </div>
        `;

        try {
            await this.sendEmail(email, subject, htmlContent);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email de notification de blocage');
            // On ne lance pas d'erreur ici car l'email est informatif
        }
    }

    /**
     * Envoie un email de confirmation de déblocage de compte
     */
    async sendAccountUnlockedEmail(email: string, firstName: string): Promise<void> {
        const subject = 'Compte débloqué - SparkOtto';
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Compte débloqué</h2>
                
                <p>Bonjour ${firstName},</p>
                
                <p>Votre compte SparkOtto a été débloqué par un administrateur.</p>
                
                <p>Vous pouvez maintenant vous connecter normalement à votre compte.</p>
                
                <p style="color: #666; font-size: 14px;">
                    Pour votre sécurité, nous vous recommandons de changer votre mot de passe.
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                    SparkOtto - Service de partage de véhicules
                </p>
            </div>
        `;

        try {
            await this.sendEmail(email, subject, htmlContent);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email de confirmation de déblocage');
        }
    }
}
export default EmailService;