import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserService from '../services/user.service';

class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if (!user || !bcrypt.compareSync(password, user.password)) {
                res.status(401).json({ message: 'Email ou mot de passe incorrect' });
                return;
            }

            const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({ token });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'Déconnexion réussie' });
    }
}

export default AuthController;