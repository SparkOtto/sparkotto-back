// import {beforeEach, describe, expect, it, jest, test} from '@jest/globals';
// import UserDAO from "../../dao/user.dao";
// import EmailService from "../email.service";
// import nodemailer from "nodemailer";
//
// jest.mock("nodemailer");
//
// describe("EmailService", () => {
//     let emailService: EmailService;
//     let sendMailMock: jest.Mock;
//
//     beforeEach(() => {
//         emailService = new EmailService();
//
//         const sendMailMock = jest.fn().mockResolvedValue({
//             accepted: ["test@example.com"],
//             rejected: [],
//             response: "250 OK",
//             messageId: "<12345@test.example.com>",
//         }) as unknown;
//
//
//
//         (nodemailer.createTransport as jest.Mock).mockReturnValue({
//             sendMail: sendMailMock
//         } as unknown as nodemailer.Transporter);
//     });
//
//     test("sendEmail doit envoyer un email avec les paramètres corrects", async () => {
//         await emailService["sendEmail"]("test@example.com", "Sujet Test", "<p>Contenu du mail</p>");
//
//         expect(sendMailMock).toHaveBeenCalledWith({
//             from: process.env.SMTP_USER,
//             to: "test@example.com",
//             subject: "Sujet Test",
//             html: "<p>Contenu du mail</p>",
//         });
//     });
//
//     test("sendEmail doit lever une erreur si l'email du destinataire est vide", async () => {
//         await expect(emailService["sendEmail"]("", "Sujet Test", "<p>Contenu</p>"))
//             .rejects.toThrow("L'adresse email du destinataire est invalide.");
//     });
//
//     test("sendEmail doit lever une erreur si l'email du destinataire est mal formaté", async () => {
//         await expect(emailService["sendEmail"]("invalid-email", "Sujet Test", "<p>Contenu</p>"))
//             .rejects.toThrow("L'adresse email du destinataire est invalide.");
//     });
//
//     test("sendConfirmationEmail doit appeler sendEmail avec un email valide", async () => {
//         const user = { name: "John Doe", email: "john@example.com" } as any;
//
//         await emailService.sendConfirmationEmail(user);
//
//         expect(sendMailMock).toHaveBeenCalledWith({
//             from: process.env.SMTP_USER,
//             to: "john@example.com",
//             subject: "Confirmation de votre inscription",
//             html: expect.stringContaining("Bonjour John Doe"),
//         });
//     });
//
//     test("sendRejectionEmail doit appeler sendEmail avec un email valide", async () => {
//         const user = { name: "Jane Doe", email: "jane@example.com" } as any;
//
//         await emailService.sendRejectionEmail(user);
//
//         expect(sendMailMock).toHaveBeenCalledWith({
//             from: process.env.SMTP_USER,
//             to: "jane@example.com",
//             subject: "Refus de votre inscription",
//             html: expect.stringContaining("Bonjour Jane Doe"),
//         });
//     });
//
// });