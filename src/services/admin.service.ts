import {User} from "@prisma/client";
import UserDAO from "../dao/user.dao";

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
}
export default AdminService;