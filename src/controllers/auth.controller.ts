import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserService from '../services/user.service';
import EmailService from '../services/email.service';
import AdminService from '../services/admin.service';

class AuthController {
    private userService: UserService;
    private emailService: EmailService;
    private adminService: AdminService;

    constructor() {
        this.userService = new UserService();
        this.emailService = new EmailService();
        this.adminService = new AdminService();
    }

    /**
     * Inscription d'un nouvel utilisateur
     * @param req
     * @param res
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, first_name, last_name, phone_number } = req.body;
            const hashedPassword = bcrypt.hashSync(password, 8);
            const userData = { ...req.body, password: hashedPassword };

            if(!email || !password || !first_name || !last_name || !phone_number) {
                res.status(400).json({ message: 'Tous les champs sont requis' });
                return;
            }

            const mailValid = await this.adminService.validateDomaine(userData.email);
            if (!mailValid.valid) {
              res.status(400).json({
                message: "Email non autorisé, veuillez vous inscrire avec votre email professionnel"
              })
              return;
            }

            userData.active = true;

            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error: any) {
            if (error.message === 'Un utilisateur avec cet email existe déjà') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Erreur serveur pour l\'inscription' });
            }
        }
    }

    /**
     * Connexion d'un utilisateur
     * @param req
     * @param res
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validation des données
            if (!email || !password) {
                res.status(400).json({ message: 'Email et mot de passe requis' });
                return;
            }

            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                res.status(401).json({ message: 'Email ou mot de passe incorrect' });
                return;
            }

            // Vérifier si le compte est verrouillé
            const isLocked = await this.userService.isUserAccountLocked(user);
            if (isLocked) {
                res.status(401).json({
                    message: 'Compte temporairement verrouillé pour des raisons de sécurité. Contactez un administrateur ou utilisez la réinitialisation de mot de passe.',
                    locked: true
                });
                return;
            }

            // Vérifier le mot de passe
            if (!bcrypt.compareSync(password, user.password)) {
                // Gérer les tentatives de connexion échouées
                const { shouldLock, attemptsLeft } = await this.userService.handleFailedLogin(email);

                if (shouldLock) {
                    // Envoyer email de notification de blocage
                    await this.emailService.sendAccountLockedEmail(user.email, user.first_name);
                    res.status(401).json({
                        message: 'Compte verrouillé suite à trop de tentatives de connexion échouées. Un email vous a été envoyé.',
                        locked: true
                    });
                } else {
                    res.status(401).json({
                        message: `Email ou mot de passe incorrect. ${attemptsLeft} tentative(s) restante(s).`,
                        attemptsLeft
                    });
                }
                return;
            }

            // Vérification si le compte est actif
            if (!user.active) {
                res.status(401).json({ message: 'Compte inactif' });
                return;
            }

            // Connexion réussie - réinitialiser les tentatives échouées
            await this.userService.handleSuccessfulLogin(user.id_user);

            const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET!, { expiresIn: '1h' });

            // Envoi du cookie sécurisé avec token
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000,
                path: '/',
                secure: false,      // Important: false en dev local quand pas HTTPS
                sameSite: 'lax',    // 'lax' pour local, sinon 'none' + HTTPS nécessaire
            });

            const userFormat = {
                id: user.id_user,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                role: await this.userService.getRoleName(user.roleId)
            }
            res.status(200).json({ token: token, user: userFormat });
        } catch (error: any) {
            if (error.message === 'Utilisateur non trouvé') {
                res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            } else {
                res.status(500).json({ message: 'Erreur serveur pour la connexion: ' + error });
            }
        }
    }

    /**
     * Déconnexion d'un utilisateur
     * @param req
     * @param res
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('token', {
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });

            res.status(200).json({ message: 'Déconnexion réussie' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erreur lors de la déconnexion : ' + error.message });
        }
    }

    /**
     * Demande de réinitialisation de mot de passe
     * @param req
     * @param res
     */
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({ message: 'Email requis' });
                return;
            }

            // Générer le token de réinitialisation
            const resetToken = await this.userService.generatePasswordResetToken(email);

            // Récupérer les infos de l'utilisateur pour l'email
            const user = await this.userService.getUserByEmail(email);

            // Envoyer l'email de réinitialisation
            await this.emailService.sendPasswordResetEmail(email, resetToken, user!.first_name);

            res.status(200).json({
                message: 'Un email de réinitialisation a été envoyé à votre adresse email'
            });

        } catch (error: any) {
            if (error.message === 'Aucun compte trouvé avec cette adresse email') {
                // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
                res.status(200).json({
                    message: 'Si un compte existe avec cette adresse email, un email de réinitialisation a été envoyé'
                });
            } else {
                res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
            }
        }
    }

    /**
     * Réinitialisation du mot de passe avec token
     * @param req
     * @param res
     */
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                res.status(400).json({ message: 'Token et nouveau mot de passe requis' });
                return;
            }

            if (newPassword.length < 6) {
                res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
                return;
            }

            // Valider le token et réinitialiser le mot de passe
            await this.userService.resetPasswordWithToken(token, newPassword);

            res.status(200).json({
                message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
            });

        } catch (error: any) {
            if (error.message === 'Token invalide ou expiré') {
                res.status(400).json({ message: 'Token invalide ou expiré' });
            } else {
                res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
            }
        }
    }

    /**
     * Validation d'un token de réinitialisation
     * @param req
     * @param res
     */
    async validateResetToken(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params;

            if (!token) {
                res.status(400).json({ message: 'Token requis' });
                return;
            }

            const email = await this.userService.validatePasswordResetToken(token);

            if (email) {
                res.status(200).json({ valid: true, email });
            } else {
                res.status(400).json({ valid: false, message: 'Token invalide ou expiré' });
            }

        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la validation du token' });
        }
    }

}

export default AuthController;