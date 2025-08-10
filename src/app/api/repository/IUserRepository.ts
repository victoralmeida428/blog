import {User} from "@/app/api/dominio/User";

export interface IUserRepository {
    /**
     * Encontra um usuário pelo seu ID único.
     * @param id O ID do usuário a ser encontrado.
     * @returns Uma Promise que resolve para a entidade User ou null se não for encontrado.
     */
    findById(id: number): Promise<User>;

    /**
     * Encontra um usuário pelo seu nome de usuário (ou e-mail).
     * @param username O nome de usuário a ser procurado.
     * @returns Uma Promise que resolve para a entidade User ou null se não for encontrado.
     */
    findByUsername(username: string): Promise<User>;

    /**
     * Encontra um usuário pelo seu nome de usuário (ou e-mail).
     * @param user O usuário a ser atualizado.
     * @returns Uma Promise que resolve para a entidade User ou null se não for encontrado.
     */
    updateUser(user: User): Promise<void>;
}