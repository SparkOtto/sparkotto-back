import {Domaines, User} from "@prisma/client";
import UserDAO from "../dao/user.dao";
import DomaineDao from "../dao/domaine.dao";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";


class AdminService {
    public userDAO: UserDAO;
    public domaineDAO: DomaineDao;

    constructor() {
        this.userDAO = new UserDAO();
        this.domaineDAO = new DomaineDao();
    }

    /**
     * Jeton de contrôle du mail de confirmation
     * @param req
     * @param res
     */
    async confirmUser(req: Request, res: Response): Promise<void> {
        try {
            const token = req.query.token as string;
            if (!token) {
                res.status(400).json({message: "Token non fourni"});
                return;
            }
            //Védification du token
            const secretKey = process.env.JWT_SECRET || "your_secret_key";
            console.log("tocken reçu: ", token);
            const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
            if (!decoded || !decoded.userId) {
                throw new Error("l'ID utilisateur n'est pas présent dans le token");
            }
            const userId = decoded.userId as number;

            // Activation du compte en base
            await this.toggleUserStatus(decoded.userId, true);

            res.status(200).json({message: "Compte activé avec succès !"});
        } catch (error) {
            res.status(400).json({message: "Token invalide ou expiré"});
        }
    }

    /**
     * Fonction pour activer ou désactiver un utilisateur
     * @param id
     * @param isActive
     */
    async toggleUserStatus(id: number, isActive: boolean): Promise<User> {
        //S'assurer que l'ID de l'utilisateur existe en base
        const userExist = await this.userDAO.getUserById(id);
        if (!userExist) {
            throw new Error('L\'utilisateur n\'a pas été trouvé');
        }
        const userData = {
            active: isActive,
            deactivation_date: isActive ? null : new Date(),
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


}

export default AdminService;