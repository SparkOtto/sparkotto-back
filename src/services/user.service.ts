import {User} from '@prisma/client';
import UserDAO from '../dao/user.dao';
import bcrypt from "bcryptjs";

class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async createUser(userData: User): Promise<User> {
    const existingUser = await this.userDAO.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }
    return this.userDAO.createUser(userData);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userDAO.searchUsers(query);
  }

  async paginateUsers(page: number, limit: number): Promise<User[]> {
    const offset = (page - 1) * limit;
    return this.userDAO.paginateUsers(offset, limit);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userDAO.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.userDAO.getUserByEmail(email);
    if(!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return existingUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDAO.getAllUsers();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.userDAO.updateUser(id, userData);
  }

  async deleteUser(id: number): Promise<User> {
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }
    return this.userDAO.deleteUser(id);
  }

  async getRoleName(roleId: number) {
    return this.userDAO.getRoleNameByRoleId(roleId);
  }
  async changePassword(id: number, oldPassword: any, newPassword: any) {
    const user = await this.userDAO.getUserById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new Error('Ancien mot de passe incorrect');
    }
    return this.userDAO.updateUser(id, { password: newPassword });
  }
}

export default UserService;