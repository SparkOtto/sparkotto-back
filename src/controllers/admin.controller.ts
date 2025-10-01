import {Request, Response} from "express";
import AdminService from '../services/admin.service';
import UserService from "../services/user.service";
import EmailService from "../services/email.service";

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
     * Activer ou désactiver un profil utilisateur
     * @param req
     * @param res
     */
    async toggleUserStatus(req: Request, res: Response): Promise<Response> {
        const id = parseInt(req.params.id);
        const isActive = req.body.isActive;
        try {
            const updateUser = await this.adminService.toggleUserStatus(id, isActive);
            return res.status(200).json(updateUser);
        } catch (error) {
            return res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur'});
        }
    }

    /**
     * Débloquer un utilisateur pour valider sa première inscription
     * ou supprimer ses données en base si l'inscription est refusée
     * @param req
     * @param res
     */
    async activateUserAccount(req: Request, res: Response): Promise<Response> {
        const id = parseInt(req.params.id);
        const isApproved = req.body; // true pour inscription acceptée ou false si refusée
        const updatedUser = await this.adminService.toggleUserStatus(id, true);

        if (typeof isApproved !== 'boolean') {
            throw new Error("Données invalides, si l'erreur persiste, veuillez contacter votre administrateur");
        }

        try {
            if (isApproved) {
                await this.emailService.sendConfirmationEmail(updatedUser); // email de validation
            } else {
                await this.emailService.sendRejectionEmail(updatedUser); // email de refus
                await this.userService.deleteUser(id); // supprimer les données en bdd
            }

            return res.status(200).json({
                message: isApproved
                    ? 'Inscription validée, un email de confirmation a été envoyé à l\'utilisateur'
                    : 'Inscription refusée, un email de confirmation a été envoyé à l\'utilisateur',
                user: updatedUser,
            });
        } catch (error) {
            return res.status(500).json({error: 'Erreur lors du taitement de l\'inscription de l\'utilisateur.'});
        }
    }

    async lockUnlockUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id, isLocked } = req.body;

            if (typeof id !== "number" || typeof isLocked !== "boolean") {
                return res.status(400).json({ message: "Données invalides" });
            }

            const user = await this.adminService.lockUnlockUser(id, isLocked);

            // Envoyer des emails de notification
            try {
                if (isLocked) {
                    // Compte bloqué - pas d'email spécifique car c'est une action admin
                } else {
                    // Compte débloqué - envoyer email de confirmation
                    await this.emailService.sendAccountUnlockedEmail(user.email, user.first_name);
                }
            } catch (emailError) {
                console.error('Erreur lors de l\'envoi de l\'email:', emailError);
                // On continue même si l'email échoue
            }

            return res.status(200).json({
                message: isLocked
                    ? 'Le compte utilisateur a été bloqué'
                    : 'Le compte utilisateur a été débloqué',
                user: {
                    id: user.id_user,
                    email: user.email,
                    account_locked: user.account_locked
                }
            });

        } catch (error) {
            console.error('Erreur dans lockUnlockUser:', error);
            return res.status(500).json({
                message: 'Une erreur s\'est produite, si le problème persiste, veuillez contacter votre administrateur'
            });
        }
    }
}

export default AdminController;