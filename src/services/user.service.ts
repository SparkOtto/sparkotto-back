import {User} from '@prisma/client';
import UserDAO from '../dao/user.dao';
import bcrypt from "bcryptjs";
import {Messages} from "../command/messages";

class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async createUser(userData: User): Promise<User> {
    const existingUser = await this.userDAO.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error(Messages.User.EMAIL_EXISTS);
    }
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      throw new Error(Messages.User.MISSING_REQUIRED_FIELDS);
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
      throw new Error(Messages.User.USER_NOT_FOUND);
    }
    return existingUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userDAO.getAllUsers();
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
        throw new Error(Messages.User.USER_NOT_FOUND);
    }
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        throw new Error(Messages.User.MISSING_REQUIRED_FIELDS);
    }
    return this.userDAO.updateUser(id, userData);
  }

  async deleteUser(id: number): Promise<User> {
    const existingUser = await this.userDAO.getUserById(id);
    if (!existingUser) {
      throw new Error(Messages.User.USER_NOT_FOUND);
    }
    return this.userDAO.deleteUser(id);
  }

  async getRoleName(roleId: number) {
    return this.userDAO.getRoleNameByRoleId(roleId);
  }
  async changePassword(id: number, oldPassword: any, newPassword: any) {
    const user = await this.userDAO.getUserById(id);
    if (!user) {
      throw new Error(Messages.User.USER_NOT_FOUND);
    }
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new Error(Messages.User.OLD_PASSWORD_INCORRECT);
    }
    return this.userDAO.updateUser(id, { password: newPassword });
  }
}

export default UserService;