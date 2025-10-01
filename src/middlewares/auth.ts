import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import UserService from '../services/user.service';

const SECRET_KEY: Secret = process.env.JWT_SECRET as Secret;

export interface CustomRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Récupération du token depuis le cookie "token"
  const token = req.cookies.token;

  console.log('Token reçu:', token);

  if (!token) {
    res.status(401).json({ message: 'Token manquant' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
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
  } catch (err) {
    res.status(403).json({ message: 'Token invalide' });
  }
}

/**
 * Middleware d'authentification requis
 * Alias pour authenticateToken avec un nom plus explicite
 */
export const requireAuth = authenticateToken;

/**
 * Middleware de vérification de rôle(s) autorisé(s)
 * Utilise le rôle déjà récupéré par authenticateToken
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Utilisateur non identifié' });
        return;
      }

      // Vérifier que l'utilisateur a un rôle valide
      if (!req.user.role) {
        res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
        return;
      }

      // Vérification que l'utilisateur a un rôle autorisé
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ 
          message: `Accès refusé : rôle ${req.user.role} non autorisé. Rôles requis: ${allowedRoles.join(', ')}` 
        });
        return;
      }

      next();
    } catch (err) {
      console.error('Erreur dans authorizeRoles:', err);
      res.status(500).json({ message: 'Erreur serveur lors de la vérification des autorisations' });
    }
  };
};

/**
 * Middleware combiné : authentification + autorisation de rôles
 * Utilise authenticateToken puis vérifie les rôles autorisés
 */
export const requireRoles = (allowedRoles: string[]) => {
  return async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // D'abord authentifier
    await authenticateToken(req, res, () => {
      // Puis vérifier les rôles
      authorizeRoles(allowedRoles)(req, res, next);
    });
  };
};

/**
 * Middleware pour vérifier un rôle spécifique
 * Raccourci pour requireRoles avec un seul rôle
 */
export const requireRole = (role: string) => {
  return requireRoles([role]);
};

/**
 * Middleware pour vérifier les droits administrateur
 * Utilise le nouveau système de rôles
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware optionnel d'authentification
 * N'échoue pas si pas de token, mais peuple req.user si token valide
 */
export const optionalAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const userService = new UserService();
    const user = await userService.getUserById(decoded.id);

    if (user && user.active && !user.account_locked) {
      const role = await userService.getRoleName(user.roleId);
      req.user = {
        id: user.id_user,
        role: role?.role_name || 'user'
      };
    }
  } catch (err) {
    // Ignore les erreurs de token en mode optionnel
  }

  next();
};

// Middlewares de convenance pour des rôles communs
export const requireUser = requireRole('user');
export const requireModerator = requireRole('moderator');
export const requireManager = requireRole('manager');

// Middleware pour plusieurs rôles autorisés
export const requireUserOrAdmin = requireRoles(['user', 'admin']);
export const requireModeratorOrAdmin = requireRoles(['moderator', 'admin']);
export const requireManagerOrAdmin = requireRoles(['manager', 'admin']);
