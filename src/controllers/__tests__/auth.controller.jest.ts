import { Request, Response } from 'express';
import AuthController from '../auth.controller';
import UserService from '../../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { describe, expect, jest } from '@jest/globals';
import { beforeEach, it } from 'node:test';

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

        req = {};
        res = {
            status: jest.fn().mockReturnThis() as jest.MockedFunction<(code: number) => Response>,
            json: jest.fn().mockReturnThis() as jest.MockedFunction<Response['json']>,
        };
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const user: User = {
                id_user: 1, email: 'test@test.com', first_name: 'Test User', password: 'hashedPassword',
                last_name: '',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: null,
                active: null,
                deactivation_date: null
            };
            userService.getUserByEmail.mockResolvedValue(user);
            (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            req.body = { email: 'test@test.com', password: 'password123' };

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
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
                account_locked: null,
                active: null,
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