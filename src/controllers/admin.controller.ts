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
     * Contrôler le mail du formulaire d'inscription
     * Si domaine valide, envoi d'un mail pour validation
     * Une fois validation faite, utilise toogleUserStatus pour activer le compte
     */

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
}

export default AdminController;