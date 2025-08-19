import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const SECRET_KEY: Secret = process.env.JWT_SECRET as Secret;

export interface CustomRequest extends Request {
  user?: string | JwtPayload; // Payload décodé
}

export const authenticateToken = (
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
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalide' });
  }
}
