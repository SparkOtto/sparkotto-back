import { Request, Response } from "express";
import AdminService from '../services/admin.service';

class AdminController{
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    /**
     * Activer ou désactiver un profil utilisateur
     * @param req
     * @param res
     */
    async toggleUserStatus(req: Request, res: Response): Promise<Response>{
        const id = parseInt(req.params.id);
        const isActive = req.body;
        try{
            const updateUser = await this.adminService.toggleUserStatus(id, isActive);
            return res.status(200).json(updateUser);
        } catch (error){
            return res.status(500).json({error: 'Erreur lors de la mise à jour de l\'utilisateur'});
        }
    }

    /**
     * Débloquer un utilisateur pour valider sa première inscription
     * @param req
     * @param res
     */
    async activateUserAccount(req: Request, res: Response): Promise<Response> {
        const id = parseInt(req.params.id);
        const isApproved = req.body; // true pour inscription acceptée ou false si refusée
        const updatedUser = await this.adminService.toggleUserStatus(id, true);

        try {
            if (typeof isApproved === 'boolean'){
                if (isApproved){
                    await this.adminService.sendConfirmationEmail(updatedUser); // email de validation
                } else {
                    await this.adminService.sendRejectionEmail(updatedUser); // email de refus
                }
            } else {
                throw new Error("Données invalides, si l'erreur perciste, veuillez contacter votre administrateur");
            }

            return res.status(200).json({
                message: isApproved
                    ? 'Inscription validée, un email de confirmation a été envoyé à l\'utilisateur'
                    : 'Inscription refusée, un email de confirmation a été envoyé à l\'utilisateur',
                user: updatedUser,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors du taitement de l\'inscription de l\'utilisateur.' });
        }
    }
}
export default AdminController;