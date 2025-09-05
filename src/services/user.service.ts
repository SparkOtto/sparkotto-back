import {User} from '@prisma/client';
import UserDAO from '../dao/user.dao';
import bcrypt from "bcryptjs";
import PasswordResetService from './password-reset.service';

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
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      throw new Error('Les informations personnelles sont incomplètes');
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
    return this.userDAO.getUserByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDAO.getAllUsers();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
    }
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        throw new Error('Les informations personnelles sont incomplètes');
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

  // Gestion des tentatives de connexion
  async handleFailedLogin(email: string): Promise<{ shouldLock: boolean; attemptsLeft: number }> {
    const user = await this.userDAO.getUserByEmail(email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const maxAttempts = 5; // Nombre maximum de tentatives
    const updatedUser = await this.userDAO.incrementFailedAttempts(user.id_user);
    const failedAttempts = updatedUser.failed_attempts || 0;
    
    if (failedAttempts >= maxAttempts) {
      await this.userDAO.lockAccount(user.id_user);
      return { shouldLock: true, attemptsLeft: 0 };
    }

    return { 
      shouldLock: false, 
      attemptsLeft: maxAttempts - failedAttempts 
    };
  }

  async handleSuccessfulLogin(id: number): Promise<void> {
    await this.userDAO.resetFailedAttempts(id);
  }

  async lockUserAccount(id: number): Promise<User> {
    return this.userDAO.lockAccount(id);
  }

  async unlockUserAccount(id: number): Promise<User> {
    return this.userDAO.unlockAccount(id);
  }

  async isUserAccountLocked(user: User): Promise<boolean> {
    return user.account_locked;
  }

  // Gestion de la réinitialisation de mot de passe
  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.userDAO.getUserByEmail(email);
    if (!user) {
      throw new Error('Aucun compte trouvé avec cette adresse email');
    }

    // Supprimer les anciens tokens pour cet email
    PasswordResetService.clearTokensForEmail(email);
    
    // Générer un nouveau token
    const token = PasswordResetService.generateResetToken(email);
    return token;
  }

  async validatePasswordResetToken(token: string): Promise<string | null> {
    return PasswordResetService.validateResetToken(token);
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<User> {
    const email = PasswordResetService.consumeResetToken(token);
    if (!email) {
      throw new Error('Token invalide ou expiré');
    }

    const user = await this.userDAO.getUserByEmail(email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    
    // Mettre à jour le mot de passe et débloquer le compte
    return this.userDAO.updateUser(user.id_user, {
      password: hashedPassword,
      failed_attempts: 0,
      account_locked: false
    });
  }
}

export default UserService;