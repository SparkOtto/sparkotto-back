import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import EmailService from '../email.service';
import { User } from '@prisma/client';

describe('EmailService', () => {
    let emailService: EmailService;
    let mockUser: User;

    beforeEach(() => {
        emailService = new EmailService();
        mockUser = {
            id_user: 1,
            first_name: 'Jean',
            last_name: 'Dupont',
            email: 'jean.dupont@example.com',
        } as User;
    });

    it('generateConfirmeToken doit retourner un token JWT', () => {
        const token = emailService.generateConfirmeToken(mockUser);
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(10);
    });

    it('getAccessToken doit retourner un accessToken (mocké)', async () => {
        // Mock de google.auth.OAuth2
        jest.spyOn(emailService as any, 'getAccessToken').mockResolvedValue('fake-access-token');
        const token = await (emailService as any).getAccessToken();
        expect(token).toBe('fake-access-token');
    });

    it('sendEmail doit lancer une erreur si email invalide', async () => {
        await expect((emailService as any).sendEmail('', 'Sujet', '<p>Contenu</p>'))
            .rejects
            .toThrow("L'adresse email du destinataire est invalide.");
    });

    it('sendEmail doit appeler nodemailer et ne pas lancer d\'erreur si tout est ok', async () => {
        jest.spyOn(emailService as any, 'getAccessToken').mockResolvedValue('fake-access-token');
        // Typage explicite du mock pour éviter l'erreur TS2345
        // @ts-ignore
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: '1' }) as unknown as (options: any) => Promise<{ messageId: string }>;
        jest.spyOn(require('nodemailer'), 'createTransport').mockReturnValue({ sendMail: sendMailMock } as any);

        await expect((emailService as any).sendEmail('test@example.com', 'Sujet', '<p>Contenu</p>')).resolves.not.toThrow();
        expect(sendMailMock).toHaveBeenCalled();
    });

    it('sendToken doit appeler sendEmail avec les bons paramètres', async () => {
        const sendEmailSpy = jest.spyOn(emailService as any, 'sendEmail').mockResolvedValue(undefined);
        process.env.APP_URL = 'http://localhost:3000';
        await emailService.sendToken(mockUser);
        expect(sendEmailSpy).toHaveBeenCalledTimes(1);
        const [to, subject, htmlContent] = sendEmailSpy.mock.calls[0];
        expect(to).toBe(mockUser.email);
        expect(subject).toContain('Confirmez');
        expect(htmlContent).toContain(mockUser.first_name);
        expect(htmlContent).toContain(process.env.APP_URL);
    });

    it('sendConfirmationEmail doit appeler sendEmail avec le bon sujet', async () => {
        const sendEmailSpy = jest.spyOn(emailService as any, 'sendEmail').mockResolvedValue(undefined);
        await emailService.sendConfirmationEmail(mockUser);
        expect(sendEmailSpy).toHaveBeenCalledWith(
            mockUser.email,
            expect.stringContaining('Confirmation'),
            expect.stringContaining(mockUser.first_name)
        );
    });

    it('sendRejectionEmail doit appeler sendEmail avec le bon sujet', async () => {
        const sendEmailSpy = jest.spyOn(emailService as any, 'sendEmail').mockResolvedValue(undefined);
        await emailService.sendRejectionEmail(mockUser);
        expect(sendEmailSpy).toHaveBeenCalledWith(
            mockUser.email,
            expect.stringContaining('Refus'),
            expect.stringContaining('regret')
        );
    });

    it('isValidEmail doit valider les emails corrects', async () => {
        expect(await emailService.isValidEmail('test@example.com')).toBe(true);
        expect(await emailService.isValidEmail('invalid-email')).toBe(false);
    });
});