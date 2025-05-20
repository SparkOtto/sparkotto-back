import { Request, Response } from 'express';
import UserService from '../services/user.service';
import bcrypt from "bcryptjs";
import Checkutils from "../command/checkutils";

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
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur pour la récupération de l\'utilisateur' });
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

      //const users = 'test';
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur serveur pour l\'obtention de tous les utilisateurs' });
    }
  }

  // Changer le mot de passe d'un utilisateur
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const oldPassword = req.body.oldPassword;
      const user = await this.userService.getUserById(id);

      if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
        res.status(401).json({ message: 'Ancien mot de passe incorrect ' + oldPassword });
        return;
      }
      const passwordEmpty = !Checkutils.empty(req.body.newPassword) && !Checkutils.empty(req.body.confirmPassword);
      if(passwordEmpty && req.body.newPassword === req.body.confirmPassword) {
        res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
        return;
      }


      const newPassword  = bcrypt.hashSync(req.body.newPassword,8);


      const result = await this.userService.changePassword(id, oldPassword, newPassword);
      res.json({ message: 'Mot de passe mis à jour avec succès', result });
    } catch (error: any) {
      if (error.message === 'Utilisateur non trouvé' || error.message === 'Ancien mot de passe incorrect') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Erreur serveur lors du changement de mot de passe' });
      }
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
        res.status(500).json({ message: 'Erreur serveur pour la suppression utilisateur' });
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
      res.status(500).json({ message: 'Erreur serveur pour la rechercher utilisateurs' });
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
      res.status(500).json({ message: 'Erreur serveur pour la pagination utilisateurs' });
    }
  }
}

export default UserController;
