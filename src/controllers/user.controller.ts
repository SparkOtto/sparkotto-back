import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Créer un nouvel utilisateur
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error : any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Obtenir un utilisateur par son ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      //const users = await this.userService.getAllUsers();
      const users = 'test';
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      res.json(updatedUser);
    } catch (error: any) {
      if (error.message === 'Utilisateur non trouvé') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Utilisateur non trouvé') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erreur serveur' });
      }
    }
  }

  // Rechercher des utilisateurs
  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const users = await this.userService.searchUsers(query);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Paginer les utilisateurs
  async paginateUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const users = await this.userService.paginateUsers(page, perPage);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}

export default UserController;
