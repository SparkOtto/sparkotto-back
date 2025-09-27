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
        const {email, userId} = req.body;

        if (!email || !userId || typeof userId != "number") {
            return res.status(400).json({error: "Email ou user invalid"})
        }

        try {
            const result = await this.adminService.validateDomaine(email);

            if (!result.valid) {
                return res.status(400).json({error: result.error});
            }

            // Récupère l'objet utilisateur pour l'utiliser dans sendToken
            const user = await this.userService.getUserById(userId);

            if (user) {
                // Envoyer l'email avec le lien de confirmation
                await this.emailService.sendToken(user);
            } else {
                return res.status(404).json({error: "Utilisateur non trouvé."})
            }


            return res.status(200).json({message: "Email envoyé pour confirmation."});
        } catch (error) {
            return res.status(500).json({error: "Erreur lors de la validation de l'email ou de l'envoi du mail."});
        }
    }

    /**
     * Activer ou désactiver un profil utilisateur
     * @param req
     * @param res
     */
    async toggleUserStatus(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.query.token as string;
            if (!token) {
                return res.status(400).json({error: 'Token manquant'});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { id: number };
            const id = decoded.id;

            const isActive = req.body;

            const updateUser = await this.adminService.toggleUserStatus(id, isActive);
            return res.status(200).json(updateUser);
        } catch (error) {
            return res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur ou token invalide'});
        }
    }

    async confirmUserAccount(req: Request, res: Response) {
        try {
            const token = req.query.token as string;
            if (!token) {
                return res.status(400).json({error: 'Token manquant'});
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
            const userId = decoded.userId;

            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({error: 'Utilisateur introuvable'});
            }

            if (user.active) {
                return res.status(200).json({message: 'Compte déjà activé'});
            }

            const updatedUser = await this.userService.updateUser(userId, {active: true});
            await this.emailService.sendConfirmationEmail(updatedUser);

            return res.status(200).json({message: 'Compte activé avec succès', user: updatedUser});
        } catch (error: any) {
            return res.status(400).json({error: 'Lien invalide ou expiré', details: error.message});
        }
    }
}
    export
    default
    AdminController;