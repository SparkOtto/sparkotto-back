// src/controllers/__tests__/auth.controller.jest.ts
import { Request, Response } from 'express';
import AuthController from '../auth.controller';
import UserService from '../../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import {describe, expect, jest} from "@jest/globals";
import {beforeEach, it} from "node:test";

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
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const user: User = { id: 1, email: 'test@test.com', name: 'Test User', password: 'password123' };
            userService.getUserByEmail.mockResolvedValue(user);
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue('token');

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
    });
});