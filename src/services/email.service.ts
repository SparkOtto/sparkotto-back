import nodemailer from "nodemailer";
import {User} from "@prisma/client";
import jwt from "jsonwebtoken";
import { google} from "googleapis";

class EmailService {

    generateConfirmeToken(user: User): string {
        const secretKey = process.env.JWT_SECRET || "uneClefParDefautSiEnvVide";
        return jwt.sign(
            {userId: user.id_user},
            secretKey,
            { expiresIn: "12h"});
    }

    async getAccessToken(): Promise<string> {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://localhost/oauth2callback.com" // L’URI que tu as défini
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const { token } = await oAuth2Client.getAccessToken();
        return token || "";

    }

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

        const accessToken = await this.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken
            }
        });

        try {
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to, // Adresse du destinataire
                subject, // Sujet du mail
                html: htmlContent, // Contenu HTML du mail
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
            throw new Error('Échec de l\'envoi de l\'email.');
        }
    }

    async sendToken (user: User): Promise<void> {
        const subjectEmail = "Confirmez votre inscription à Spark oTTo";
        const token = this.generateConfirmeToken(user);
        const confirmationLink = `${process.env.APP_URL}/confirm?token=${token}`;

        //contenu du mail
        const htmlContent = `
            <p>Bonjour ${user.first_name},</p>
            <p>Nous avons bien reçu votre demande d\'inscription à Spark oTTo</p>
            <p>Veuillez confirmer votre email en cliquant sur ce lien :</p>
            <p><a href="${confirmationLink}">Confirmer mon inscription</a></p>
            <p>Ce lien et valide pendant 12 heures</p>
        `;
        await this.sendEmail(user.email, subjectEmail, htmlContent);

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
}
export default EmailService;