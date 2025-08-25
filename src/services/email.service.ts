import nodemailer from "nodemailer";
import {User} from "@prisma/client";
import jwt from "jsonwebtoken";
import {google} from "googleapis";
import user from "../routes/user";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class EmailService {

    generateConfirmeToken(user: User): string {
        const secretKey = process.env.JWT_SECRET || "uneClefParDefautSiEnvVide";
        return jwt.sign(
            {userId: user.id_user},
            secretKey,
            {expiresIn: "12h"});
    }

    async getAccessToken(): Promise<string> {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const {token} = await oAuth2Client.getAccessToken();
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
        // générer le token qui permet d'envoyer le mail
        const accessToken = await this.getAccessToken();

        // Créer le transporteur SMTP avec OAuth2
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken,
            },
            tls: {rejectUnauthorized: false} // Accepter les certificats auto-signés
        });

        try {
            const sendMailPromise = transporter.sendMail({
                from: process.env.GMAIL_USER,
                to,
                subject,
                // text: "Message texte",
                html: htmlContent,
            });

            const infoMail = await Promise.race([
                sendMailPromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout SMTP')), 5000))
            ]);
            console.log('sendEmail infoMail : ', infoMail);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email :", error);
            throw new Error('Échec de l\'envoi de l\'email.');
        }
    }

    async sendToken(user: User): Promise<void> {
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
        console.log('service : appel de la méthode sendEmail');
        await this.sendEmail(user.email, subjectEmail, htmlContent);
        console.log('sendEmail : utilisateur =', user);
        console.log('sendEmail : lien =', confirmationLink);

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