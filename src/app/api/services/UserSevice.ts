import bcrypt from 'bcrypt';
import {IUserRepository} from "@/app/api/repository/IUserRepository";
import {User} from "@/app/api/dominio/User";
import {NotFoundError} from "@/app/api/errors/NotFoundError";
import {AuthenticationError} from "@/app/api/errors/AuthenticationError";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {
    }

    async changePassword(usuario: string, plaintextPassword: string): Promise<void> {
        // Define o "custo" do hash. 10 ou 12 é um bom valor padrão.
        const saltRounds = 10;

        // Gera o hash da senha de forma assíncrona.
        const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);

        // Agora você cria e salva o usuário com a senha HASHEADA.
        const user = await this.userRepository.findByUsername(usuario);

        if (!user) {
            throw new NotFoundError("User");
        }

        user.changePassword(hashedPassword);
        await this.userRepository.updateUser(user);
    }

    /**
     * Verifica se o usuário existe e se as senhas batem
     * @param usuario
     * @param plaintextPassword
     */
    async login(usuario: string, plaintextPassword: string): Promise<User> {
        // Busca o usuário pelo nome de usuário ou e-mail.
        const user = await this.userRepository.findByUsername(usuario);

        if (!user) throw new NotFoundError("User");

        // Usa o método da nossa classe de domínio para verificar a senha.
        const isPasswordCorrect = await user.checkPassword(plaintextPassword);

        if (!isPasswordCorrect) throw new AuthenticationError();

        return user;
    }

    async searchUser(username: string): Promise<User> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new NotFoundError("User");
        return user;
    }

    async getUser(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError("User");
        return user;
    }
}