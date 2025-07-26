import {Request, Response} from "express";
import AdminService from '../services/admin.service';
import UserService from "../services/user.service";
import EmailService from "../services/email.service";
import jwt from "jsonwebtoken";

class AdminController {
    private adminService: AdminService;
    private userService: UserService;
    private emailService: EmailService;

    constructor() {
        this.adminService = new AdminService();
        this.userService = new UserService();
        this.emailService = new EmailService();
    }

    /**
     * Si l'utilisateur demande à reçevoir un nouveau mail de confirmation
     */
    async validUserWithEmail(req: Request, res: Response): Promise<Response> {
        const { email, userId } = req.body;

        if (!email || !userId || typeof userId != "number"){
            return res.status(400).json({ error: "Email ou user invalid"})
        }

        try {
            const result = await this.adminService.validateDomaine(email);

            if (!result.valid) {
                return res.status(400).json({ error: result.error });
            }

            // Récupère l'objet utilisateur pour l'utiliser dans sendToken
            const user = await this.userService.getUserById(userId);

            if (user){
                // Envoyer l'email avec le lien de confirmation
                await this.emailService.sendToken(user);
            } else {
                return res.status(404).json({ error: "Utilisateur non trouvé."})
            }


            return res.status(200).json({ message: "Email envoyé pour confirmation." });
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la validation de l'email ou de l'envoi du mail." });
        }
    }

    /**
     * Activer ou désactiver un profil utilisateur
     * @param req
     * @param res
     */
    async toggleUserStatus(req: Request, res: Response): Promise<Response> {
        const id = parseInt(req.params.id);
        const isActive = req.body;
        try {
            const updateUser = await this.adminService.toggleUserStatus(id, isActive);
            return res.status(200).json(updateUser);
        } catch (error) {
            return res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur'});
        }
    }

    /**
     * route pour tester l'envoi de mail avec postman
     */
    async testEmail(req: Request, res: Response): Promise<Response> {
        const user =req.body;
        try {
            const sendMail = await this.emailService.sendConfirmationEmail(user);
            return res.status(200).json('lolo');
        } catch (error) {
            return res.status(500).json({error: 'test en erreur'});
        }
    }
}

export default AdminController;