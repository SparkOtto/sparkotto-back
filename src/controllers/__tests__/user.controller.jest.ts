// src/controllers/__tests__/user.controller.jest.ts
import { Request, Response } from 'express';
import UserController from '../user.controller';
import UserService from '../../services/user.service';
import { User } from '@prisma/client';
import {describe, expect, jest} from "@jest/globals";
import {beforeEach, it} from "node:test";

jest.mock('../../services/user.service');

describe('UserController', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = new UserService() as jest.Mocked<UserService>;
        userController = new UserController();
        userController['userService'] = userService;

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user: User = { id: 1, email: 'test@test.com', name: 'Test User', password: 'password123' };
            userService.getUserById.mockResolvedValue(user);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            userService.getUserById.mockResolvedValue(null);

            req.params = { id: '1' };

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
        });
    });
});