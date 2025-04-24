import {User} from "@prisma/client";
import UserDAO from "../dao/user.dao";
import nodemailer from 'nodemailer';

class AdminService {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    /**
     * Fonction pour activer ou désactiver un utilisateur
     * @param id
     * @param isActive
     */
    async toggleUserStatus(id: number, isActive: boolean): Promise<User>{
        //S'assurer que l'ID de l'utilisateur existe en base
        const userExist = await this.userDAO.getUserById(id);
        if(!userExist){
            throw new Error('L\'utilisateur n\'a pas été trouvé)');
        }
        const userData = {active: isActive};
        return this.userDAO.updateUser(id, userData);
    }

    private async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            //TODO Créer un fichier de constantes pour mail + mdp à mettre ici
            host: 'smtp.example.com', // TODO Remplacez par le nom du serveur SMTP
            port: 587, // Port standard SMTP
            secure: false, // true pour SSL (si le serveur le supporte)
            auth: {
                user: 'sparkOtto@example.com', // TODO Remplacez par le email
                pass: 'sparkOtto-password' // TODO Remplacez le mot de passe
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

    async sendConfirmationEmail(user: User): Promise<void> {
        const subject = 'Confirmation de votre inscription';
        const htmlContent = `<p>Bonjour ${user.name},</p>
                             <p>Nous sommes heureux de vous informer que votre inscription a été validée.</p>
                             <p>Bienvenue parmi nous !</p>`;
        await this.sendEmail(user.email, subject, htmlContent);
    }

    async sendRejectionEmail(user: User): Promise<void> {
        const subject = 'Refus de votre inscription';
        const htmlContent = `<p>Bonjour ${user.name},</p>
                             <p>Nous sommes au regret de vous informer que votre inscription a été refusée.</p>
                             <p>N'hésitez pas à nous contacter pour plus d'informations.</p>`;
        await this.sendEmail(user.email, subject, htmlContent);
    }
}
export default AdminService;