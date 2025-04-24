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
}
export default AdminController;