import {IUserRepository} from '@/app/api/repository/IUserRepository';
import {User} from '@/app/api/dominio/User';
import {randomBytes} from 'crypto';
import {ISessionRepository} from '@/app/api/repository/ISessionRepository';
import {Session, SessionDTO} from "@/app/api/dominio/Session";
import {AuthenticationError} from "@/app/api/errors/AuthenticationError"; // Assumindo uma interface para o repositório de sessões


export class AuthService {
    // Agora depende de ambos os repositórios
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionRepository: ISessionRepository
    ) {
    }

    /**
     * Cria uma nova sessão para um utilizador após o login.
     * @param user A entidade do utilizador autenticado.
     * @returns O objeto da sessão criada.
     */
    public async createSession(user: User): Promise<Session> {
        // 1. Gerar um ID de sessão seguro e aleatório
        const sessionId = randomBytes(32).toString('hex');

        // 2. Definir o tempo de expiração da sessão (ex: 24 horas)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // 3. Criar o objeto da sessão
        const session: SessionDTO = {
            id: sessionId,
            userId: user.id!,
            expiresAt,
        };

        // 4. Salvar a sessão no banco de dados através do repositório de sessões
        return this.sessionRepository.create(session);
    }

    /**
     * Verifica um ID de sessão e retorna o utilizador associado.
     * @param sessionId O ID da sessão a ser verificado (vindo de um cookie).
     * @returns A entidade do utilizador se a sessão for válida, ou null caso contrário.
     */
    public async validateSession(sessionId: string): Promise<User> {
        const session = await this.sessionRepository.findById(sessionId);

        // Verifica se a sessão existe e não expirou
        if (!session || session.expiresAt < new Date()) throw new AuthenticationError()

        // Retorna os dados do utilizador associado à sessão
        return this.userRepository.findById(session.userId);
    }

    /**
     * Invalida (destrói) uma sessão.
     * @param sessionId O ID da sessão a ser destruída.
     */
    public async destroySession(sessionId: string): Promise<void> {
        await this.sessionRepository.delete(sessionId);
    }
}
