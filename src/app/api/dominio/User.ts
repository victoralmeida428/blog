import bcrypt from 'bcrypt';

export type UserDTO = {
    id: number,
    username: string,
    email: string,
    name: string,
    password_hash: string,
    isAdmin: boolean,
}

export class User {
    constructor(
        public readonly id: number | null,
        public username: string,
        public email: string,
        public name: string,
        public password_hash: string,
        private _isAdmin: boolean,
    ) {
    }

    isAdmin() {
        return this._isAdmin;
    }

    /**
     * Método para alterar a senha
     * @param newHashedPassword
     */
    public changePassword(newHashedPassword: string): void {
        this.password_hash = newHashedPassword;
    }


    /**
     * Compara uma senha em texto puro com o hash armazenado.
     * @param plaintextPassword A senha que o usuário digitou (ex: no formulário de login).
     * @returns Uma Promise que resolve para 'true' se a senha corresponder, ou 'false' caso contrário.
     */
    async checkPassword(plaintextPassword: string): Promise<boolean> {
        // bcrypt.compare é assíncrono e faz todo o trabalho pesado de forma segura.
        return bcrypt.compare(plaintextPassword, this.password_hash);
    }

    static reconstitute(data: UserDTO): User {
        return new User(
            data.id,
            data.username,
            data.email,
            data.name,
            data.password_hash,
            data.isAdmin
        );

    }

}