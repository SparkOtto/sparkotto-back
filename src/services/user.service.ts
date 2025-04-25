import {User} from '@prisma/client';
import UserDAO from '../dao/user.dao';

class UserService {
    private userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    async deleteUser(id: number): Promise<User> {
        const existingUser = await this.userDAO.getUserById(id);
        if (!existingUser) {
            throw new Error('Utilisateur non trouvé');
        }
        return this.userDAO.deleteUser(id);
    }
}

export default UserService;