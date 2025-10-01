import { Request, Response } from 'express';
import AuthController from '../auth.controller';
import UserService from '../../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { describe, expect, jest, beforeEach, it } from '@jest/globals';

jest.mock('../../services/user.service');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let authController: AuthController;
    let userService: jest.Mocked<UserService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = new UserService() as jest.Mocked<UserService>;
        authController = new AuthController();
        authController['userService'] = userService;

        req = {
            cookies: {},
        } as Partial<Request>;

        req = {};
        res = {
            status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => Response>,
            json: jest.fn().mockReturnThis() as jest.MockedFunction<Response['json']>,
            cookie: jest.fn().mockReturnThis(),
        } as Partial<Response>;
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const user: User = {
                id_user: 1,
                email: 'test@test.com',
                first_name: 'Test User',
                password: 'hashedPassword',
                last_name: '',
                phone_number: null,
                roleId: 1,
                agency_id: null,
                license_number: null,
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            };
            userService.getUserByEmail.mockResolvedValue(user);
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            req.body = { email: 'test@test.com', password: 'password123' };

            await authController.login(req as Request, res as Response);

            // Debug: check what status was actually called with
            // console.log((res.status as jest.Mock).mock.calls);

            const userFormat = {
                id: 1,
                first_name: 'Test User',
                last_name: '',
                email: 'test@test.com',
                phone_number: null,
                role: undefined
            };

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token', user: userFormat });
        });

        it('should return 401 for invalid credentials', async () => {
            userService.getUserByEmail.mockResolvedValue(null);

            req.body = { email: 'test@test.com', password: 'password123' };

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
        });

        it('should return 401 if password is incorrect', async () => {
            const user: User = {
                id_user: 1, email: 'test@test.com', first_name: 'Test User', password: 'hashedPassword',
                last_name: 'test',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: false,
                active: false,
                deactivation_date: null
            };
            userService.getUserByEmail.mockResolvedValue(user);
            (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

            req.body = { email: 'test@test.com', password: 'wrongPassword' };

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
        });
    });
});