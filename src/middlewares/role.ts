import { Response, NextFunction } from 'express';
import { CustomRequest } from './auth'; // type étendu avec user
import { getRoleByUserId } from '../dao/user.dao';

// Middleware vérification rôle(s)
export const authorizeRoles = (allowedRoles: string[]) => {
  return async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req.user as any)?.id;

      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non identifié' });
        return;
      }

      // Récupérer le rôle unique de l'utilisateur en base
      const userRoleObj = await getRoleByUserId(userId);

      if (!userRoleObj || !userRoleObj.role_name) {
        res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
        return;
      }

      // Vérification que l'utilisateur a un rôle autorisé
      if (!allowedRoles.includes(userRoleObj.role_name)) {
        res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
        return;
      }

      next();
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};
