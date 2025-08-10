/* eslint-disable */
import {IUserRepository} from '@/app/api/repository/IUserRepository';
import {User} from '@/app/api/dominio/User';
import {NotFoundError} from '@/app/api/errors/NotFoundError';
import bcrypt from 'bcrypt';
import {UserService} from "@/app/api/services/UserSevice";
import {AuthenticationError} from "@/app/api/errors/AuthenticationError";

// Mock das dependências
jest.mock('@/app/api/repository/IUserRepository');
jest.mock('bcrypt');

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockBcrypt: jest.Mocked<typeof bcrypt>;

    beforeEach(() => {
        // Criamos um mock do repositório com todos os seus métodos
        mockUserRepository = {
            findByUsername: jest.fn(),
            updateUser: jest.fn(),
            findById: jest.fn(),
        };

        // Instanciamos o serviço com o repositório falso
        userService = new UserService(mockUserRepository);

        // Tipamos o bcrypt mockado para ter acesso aos seus métodos
        mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    });

    afterEach(() => {
        // Limpa todos os mocks após cada teste
        jest.clearAllMocks();
    });

    // ======================================================
    // Testes para o método changePassword
    // ======================================================
    describe('changePassword', () => {
        it('should hash the new password and update the user', async () => {
            // ARRANGE
            const fakeUser = new User(1, 'testuser', 'test@example.com', 'Test User', 'old_hash', false);
            const newPassword = 'newPassword123';
            const newHashedPassword = 'new_hashed_password';

            mockUserRepository.findByUsername.mockResolvedValue(fakeUser);
            mockBcrypt.hash.mockResolvedValue(newHashedPassword as unknown as never);

            const changePasswordSpy = jest.spyOn(fakeUser, 'changePassword');

            // ACT
            await userService.changePassword('testuser', newPassword);

            // ASSERT
            expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('testuser');
            expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
            expect(changePasswordSpy).toHaveBeenCalledWith(newHashedPassword);

            // CORREÇÃO: Passamos a referência da função mock para o expect.
            expect(mockUserRepository.updateUser).toHaveBeenCalledWith(fakeUser);
        });

        it('should throw a NotFoundError if the user does not exist', async () => {
            // ARRANGE
            mockUserRepository.findByUsername.mockResolvedValue(null as unknown as User);

            // ACT & ASSERT
            await expect(userService.changePassword('nonexistentuser', 'password')).rejects.toThrow(NotFoundError);
        });
    });

    // ======================================================
    // Testes para o método login
    // ======================================================
    describe('login', () => {
        it('should return the user if credentials are correct', async () => {
            // ARRANGE
            const fakeUser = new User(1, 'testuser', 'test@example.com', 'Test User', 'correct_hash', false);
            jest.spyOn(fakeUser, 'checkPassword').mockResolvedValue(true);

            mockUserRepository.findByUsername.mockResolvedValue(fakeUser);

            // ACT
            const result = await userService.login('testuser', 'correct_password');

            // ASSERT
            expect(result).toBe(fakeUser);
            expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('testuser');
            expect(fakeUser.checkPassword).toHaveBeenCalledWith('correct_password');
        });

        it('should throw a NotFoundError if user does not exist', async () => {
            mockUserRepository.findByUsername.mockResolvedValue(null as unknown as User);

            // ACT & ASSERT
            await expect(userService.login('nonexistentuser', 'password')).rejects.toThrow(NotFoundError);
        });

        it('should throw an AuthenticatorError if password is incorrect', async () => {

            const fakeUser = new User(1, 'testuser', 'test@example.com', 'Test User', 'correct_hash', false);
            jest.spyOn(fakeUser, 'checkPassword').mockResolvedValue(false);

            mockUserRepository.findByUsername.mockResolvedValue(fakeUser);

            // ACT & ASSERT
            await expect(userService.login('testuser', 'wrong_password')).rejects.toThrow(AuthenticationError);
        });
    });
});
