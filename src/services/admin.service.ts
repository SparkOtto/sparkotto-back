import {Domaines, User} from "@prisma/client";
import UserDAO from "../dao/user.dao";
import DomaineDao from "../dao/domaine.dao";
import {Request, Response} from "express";


class AdminService {
    public userDAO: UserDAO;
    public domaineDAO: DomaineDao;

    constructor() {
        this.userDAO = new UserDAO();
        this.domaineDAO = new DomaineDao();
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
            throw new Error('L\'utilisateur n\'a pas été trouvé');
        }
        const userData = {
            active: isActive,
            deactivation_date: isActive ? null : new Date() ,
        };
        return this.userDAO.updateUser(id, userData);
    }

    /**
     * Contrôle sur le domaine de l'adresse mail renseignée est
     * dans la liste des domaines autorisés
     * @param email
     */
    async validateDomaine(email: string) {
        if (!email) {
            return {valid: false, error: "Email non fourni"};
        }

        // Vérification du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {valid: false, error: "Format d'email invalide"};
        }

        // Tester la valeur du domaine
        const domaine = email.split('@')[1];
        try {
            // requête pour tester le domaine
            const domaineAutorise = await this.domaineDAO.getDomaine(domaine);

            if (domaineAutorise) {
                return {valid: true, domaine}
            } else {
                return {valid: false, error: `Domaine '${domaine}' non autorisé`};
            }
        } catch (error) {
            return {valid: false, error: "Erreur lors de la vérification du domaine"};
        }
    }

    /**
     * Bloquer ou débloquer un utilisateur
     * @param id
     * @param isLocked
     */
    async lockUnlockUser(id: number, isLocked: boolean): Promise<User>{
        const userExist = await this.userDAO.getUserById(id);
        if(!userExist){
            throw new Error('L\'utilisateur n\'a pas été trouvé');
        }
        const userData = {account_locked: isLocked};
        return this.userDAO.updateUser(id, userData);
    }
}

export default AdminService;