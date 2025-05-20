import UserService from '../user.service';
import UserDAO from '../../dao/user.dao';
import { User } from '@prisma/client';
import {describe, expect, jest, beforeEach, it} from "@jest/globals";


jest.mock('../../dao/user.dao');

describe('UserService', () => {
    let userService: UserService;
    let userDAO: jest.Mocked<UserDAO>;

    beforeEach(() => {
        userDAO = new UserDAO() as jest.Mocked<UserDAO>;
        userService = new UserService();
        userService['userDAO'] = userDAO;
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData: Omit<User, 'id'> = {
                email: 'test@test.com',
                first_name: 'Test User',
                password: 'password123',
                id_user: 1,
                last_name: '',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: false,
                active: false,
                deactivation_date: new Date("2199-04-05 10:00:00")
            };

            userDAO.getUserByEmail.mockResolvedValue(null);
            userDAO.createUser.mockResolvedValue({ ...userData });

            const result = await userService.createUser(userData);

            expect(result).toEqual({ ...userData });
            expect(userDAO.getUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(userDAO.createUser).toHaveBeenCalledWith(userData);
        });

        it('should throw an error if user already exists', async () => {
            const userData: Omit<User, 'id'> = {
                email: 'test@test.com',
                first_name: 'Test User',
                password: 'password123',
                last_name: 'last',
                agency_id: 0,
                roleId: 0,
                phone_number: "0123456",
                id_user: 1,
                license_number: null,
                failed_attempts: null,
                account_locked: false,
                active: false,
                deactivation_date: new Date("2199-04-05 10:00:00"),
            };

            userDAO.getUserByEmail.mockResolvedValue({ ...userData });

            await expect(userService.createUser(userData)).rejects.toThrow('Un utilisateur avec cet email existe déjà');
            expect(userDAO.getUserByEmail).toHaveBeenCalledWith(userData.email);
            expect(userDAO.createUser).not.toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user: User = {
                id_user: 1,
                email: 'test@test.com',
                first_name: 'Test User',
                password: 'password123',
                last_name: '',
                phone_number: null,
                roleId: 0,
                agency_id: null,
                license_number: null,
                failed_attempts: null,
                account_locked: false,
                active: false,
                deactivation_date: new Date("2199-04-05 10:00:00")
            };

            userDAO.getUserById.mockResolvedValue(user);

            const result = await userService.getUserById(1);

            expect(result).toEqual(user);
            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        });

        it('should return null if user not found', async () => {
            userDAO.getUserById.mockResolvedValue(null);

            const result = await userService.getUserById(1);

            expect(result).toBeNull();
            expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        });
    });
});