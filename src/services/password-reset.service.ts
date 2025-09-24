import crypto from 'crypto';

interface ResetToken {
    email: string;
    token: string;
    expiresAt: Date;
}

class PasswordResetService {
    private tokens: Map<string, ResetToken> = new Map();

    /**
     * Génère un token de réinitialisation
     */
    generateResetToken(email: string): string {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token valide 1 heure

        this.tokens.set(token, {
            email,
            token,
            expiresAt
        });

        // Nettoyer les tokens expirés
        this.cleanExpiredTokens();

        return token;
    }

    /**
     * Valide un token de réinitialisation
     */
    validateResetToken(token: string): string | null {
        const resetToken = this.tokens.get(token);
        
        if (!resetToken) {
            return null;
        }

        if (resetToken.expiresAt <= new Date()) {
            this.tokens.delete(token);
            return null;
        }

        return resetToken.email;
    }

    /**
     * Supprime un token après utilisation
     */
    consumeResetToken(token: string): string | null {
        const email = this.validateResetToken(token);
        if (email) {
            this.tokens.delete(token);
        }
        return email;
    }

    /**
     * Nettoie les tokens expirés
     */
    private cleanExpiredTokens(): void {
        const now = new Date();
        for (const [token, resetToken] of this.tokens.entries()) {
            if (resetToken.expiresAt <= now) {
                this.tokens.delete(token);
            }
        }
    }

    /**
     * Supprime tous les tokens d'un email (utile en cas de demandes multiples)
     */
    clearTokensForEmail(email: string): void {
        for (const [token, resetToken] of this.tokens.entries()) {
            if (resetToken.email === email) {
                this.tokens.delete(token);
            }
        }
    }
}

// Singleton pour persister les tokens pendant la durée de vie de l'application
export default new PasswordResetService();
