import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';

interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'Token d\'authentification requis' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const userService = new UserService();
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        if (!user.active) {
            res.status(401).json({ message: 'Compte inactif' });
            return;
        }

        if (user.account_locked) {
            res.status(401).json({ message: 'Compte verrouillé' });
            return;
        }

        const role = await userService.getRoleName(user.roleId);
        req.user = {
            id: user.id_user,
            role: role?.role_name || 'user'
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    await requireAuth(req, res, () => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Accès administrateur requis' });
            return;
        }
        next();
    });
};
