import { PrismaClient, User } from '@prisma/client';

class UserDAO {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Créer un nouvel utilisateur
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  // Obtenir un utilisateur par son ID
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Obtenir un utilisateur par son email
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Rechercher des utilisateurs
  async searchUsers(query: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  // Paginer les utilisateurs
  async paginateUsers(page: number, perPage: number): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }
}

export default UserDAO;
