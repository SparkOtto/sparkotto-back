import { User } from '@prisma/client';
import UserDAO from '../dao/user.dao';

class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    // Vous pouvez ajouter ici une logique métier supplémentaire si nécessaire
    // Par exemple, vérifier si l'email est unique avant de créer l'utilisateur
    const existingUser = await this.userDAO.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }
    return this.userDAO.createUser(userData);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userDAO.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userDAO.getUserByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDAO.getAllUsers();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    // Vous pouvez ajouter ici une logique de validation supplémentaire
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.userDAO.updateUser(id, userData);
  }

  async deleteUser(id: number): Promise<User> {
    // Vous pouvez ajouter ici une logique supplémentaire
    // Par exemple, vérifier si l'utilisateur peut être supprimé
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.userDAO.deleteUser(id);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userDAO.searchUsers(query);
  }

  async paginateUsers(page: number, perPage: number): Promise<User[]> {
    return this.userDAO.paginateUsers(page, perPage);
  }
}

export default UserService;
