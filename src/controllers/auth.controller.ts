import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserService from '../services/user.service';
import userService from "../services/user.service";

class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Inscription d'un nouvel utilisateur
     * @param req
     * @param res
     */
    async register(req: Request, res: Response): Promise<void> {
        //res.status(200).json(req.body);
        try {
            const { email, password, first_name, last_name, phone_number } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 8);
            const userData = { ...req.body, password: hashedPassword };
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error: any) {
            if (error.message === 'Un utilisateur avec cet email existe déjà') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erreur serveur pour l\'inscription : ' + error });
            }
        }
    }

    /**
     * Connexion d'un utilisateur
     * @param req
     * @param res
     */
    async login(req: Request, res: Response): Promise<void> {
        //res.status(200).json(req.body);
        try {
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).json({ message: 'Email ou mot de passe incorrect' });
                return;
            }

            const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            const userFormat = {
                id: user.id_user,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                role: await this.userService.getRoleName(user.roleId)
            }
            res.json({ token: token, user: userFormat });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur serveur pour la connexion: ' + error });
        }
    }

    /**
     * Déconnexion d'un utilisateur
     * @param req
     * @param res
     */
    async logout(req: Request, res: Response): Promise<void> {

        res.status(200).json({ message: 'Déconnexion réussie' });
    }
}

export default AuthController;