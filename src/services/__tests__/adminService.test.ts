import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import UserDAO from "../../dao/user.dao";
import AdminService from "../admin.service";

jest.mock('../../dao/user.dao')

describe('AdminService', () => {
    let adminService: AdminService;
    let userDAO: jest.Mocked<UserDAO>;

    beforeEach(() => {
        userDAO = jest.mocked(new UserDAO()); // Cast en tant que Mocked<UserDAO>
        adminService = new AdminService();
        adminService.userDAO = userDAO; // Injecter le DAO mocké
    });

    it('test_toggleUserStatus', async () => {
        const userTest = {
            id_user: 1,
            first_name: "Test",
            last_name: "User",
            email: "test@example.com",
            phone_number: null,
            password: "hashed_password",
            roleId: 2,
            agency_id: null,
            license_number: null,
            failed_attempts: 0,
            account_locked: false,
            active: true,
            deactivation_date: null,
        };
        jest.spyOn(userDAO, 'getUserById').mockResolvedValue(userTest);
        jest.spyOn(userDAO, 'updateUser').mockResolvedValue({ ...userTest, active: true });
        const result = await adminService.toggleUserStatus(1, true);

        expect(userDAO.getUserById).toHaveBeenCalledWith(1);
        expect(userDAO.updateUser).toHaveBeenCalledWith(1, { active: true, deactivation_date: null });
        expect(result).toEqual({ ...userTest, active: true });
    });

    it('test_toggleUserStatus_erreur', async () => {
        jest.spyOn(userDAO, 'getUserById').mockResolvedValue(null); // utilisateur absent

        await expect(adminService.toggleUserStatus(2, true)).rejects.toThrow('L\'utilisateur n\'a pas été trouvé');
        expect(userDAO.getUserById).toHaveBeenCalledWith(2);
        expect(userDAO.updateUser).not.toHaveBeenCalled();
    });
});
