/* eslint-disable */
import {IUserRepository} from '@/app/api/repository/IUserRepository';
import {ISessionRepository} from '@/app/api/repository/ISessionRepository';
import {User} from '@/app/api/dominio/User';
import {AuthenticationError} from '@/app/api/errors/AuthenticationError';
import {AuthService} from "@/app/api/services/AuthServer";
import {Session, SessionDTO} from "@/app/api/dominio/Session";

// Mock das dependências
jest.mock('@/app/api/repository/IUserRepository');
jest.mock('@/app/api/repository/ISessionRepository');

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockSessionRepository: jest.Mocked<ISessionRepository>;

    // Dados falsos para serem usados nos testes
    const fakeUser = new User(1, 'testuser', 'test@example.com', 'Test User', 'hashed_password', false);

    beforeEach(() => {
        // Criamos mocks dos repositórios com todos os seus métodos
        mockUserRepository = {
            findById: jest.fn(),
            findByUsername: jest.fn(),
            updateUser: jest.fn(),
        };
        mockSessionRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
        };

        // Instanciamos o serviço com os repositórios falsos
        authService = new AuthService(mockUserRepository, mockSessionRepository);
    });

    afterEach(() => {
        // Limpa todos os mocks após cada teste
        jest.clearAllMocks();
    });

    // ===================================
    // Testes para createSession
    // ===================================
    describe('createSession', () => {
        it('should create and return a new session', async () => {
            // ARRANGE
            // Configuramos o mock para retornar a sessão que foi passada para ele
            mockSessionRepository.create.mockImplementation(session => Promise.resolve(session as any));

            // ACT
            const session = await authService.createSession(fakeUser);

            // ASSERT
            expect(session).toBeDefined();
            expect(session.userId).toBe(fakeUser.id);
            expect(session.id).toEqual(expect.any(String)); // Verifica se o ID é uma string
            expect(session.id.length).toBe(64); // 32 bytes em hexadecimal
            expect(session.expiresAt).toBeInstanceOf(Date);
            expect(mockSessionRepository.create).toHaveBeenCalledWith(session);
        });
    });

    // ===================================
    // Testes para validateSession
    // ===================================
    describe('validateSession', () => {
        it('should return the user for a valid session', async () => {
            // ARRANGE
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 1);
            const fakeSession: SessionDTO = {id: 'valid_session_id', userId: fakeUser.id!, expiresAt: futureDate};


            mockSessionRepository.findById.mockResolvedValue(Session.reconstitute(fakeSession));
            mockUserRepository.findById.mockResolvedValue(fakeUser);

            // ACT
            const user = await authService.validateSession('valid_session_id');

            // ASSERT
            expect(user).toEqual(fakeUser);
            expect(mockSessionRepository.findById).toHaveBeenCalledWith('valid_session_id');
            expect(mockUserRepository.findById).toHaveBeenCalledWith(fakeUser.id);
        });

        it('should throw AuthenticationError for a non-existent session', async () => {
            // ARRANGE
            mockSessionRepository.findById.mockResolvedValue(null as unknown as Promise<Session>);

            // ACT & ASSERT
            await expect(authService.validateSession('invalid_session_id')).rejects.toThrow(AuthenticationError);
        });

        it('should throw AuthenticationError for an expired session', async () => {
            // ARRANGE
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1);
            const expiredSession: SessionDTO = {id: 'expired_session_id', userId: fakeUser.id!, expiresAt: pastDate};

            mockSessionRepository.findById.mockResolvedValue(Session.reconstitute(expiredSession));

            // ACT & ASSERT
            await expect(authService.validateSession('expired_session_id')).rejects.toThrow(AuthenticationError);
        });
    });

    // ===================================
    // Testes para destroySession
    // ===================================
    describe('destroySession', () => {
        it('should call the repository to delete the session', async () => {
            // ARRANGE
            const sessionId = 'session_to_delete';
            mockSessionRepository.delete.mockResolvedValue(); // Simula uma deleção bem-sucedida

            // ACT
            await authService.destroySession(sessionId);

            // ASSERT
            expect(mockSessionRepository.delete).toHaveBeenCalledWith(sessionId);
        });
    });
});
