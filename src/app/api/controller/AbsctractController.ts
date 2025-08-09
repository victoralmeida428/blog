import {AppError} from "@/app/api/errors/AppError";
import {InternalError} from "@/app/api/errors/InternalError";
import {NextRequest, NextResponse} from "next/server";
import {User} from "@/app/api/dominio/User";
import {AuthenticationError} from "@/app/api/errors/AuthenticationError";
import {UserService} from "@/app/api/services/UserSevice";
import {NotFoundError} from "@/app/api/errors/NotFoundError";

export type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export abstract class AbstractController {
    constructor(protected readonly userService: UserService) {
    }

    async getID(context: RouteContext): Promise<number> {
        const {params} = context;
        const {id} = await params;
        const idInt = parseInt(id, 10);
        if (isNaN(idInt)) {
            throw new AppError("Not a valid id");
        }
        return idInt;
    }


    // Isto iria dentro da sua classe UserController

    async getUser(request: NextRequest): Promise<User> {

        // 1. Pega o cabeçalho 'x-user-id' que foi adicionado pelo middleware
        const userIdHeader = request.headers.get('x-user-id');

        // 2. Valida se o cabeçalho existe
        if (!userIdHeader) {
            // Este erro significa que o middleware não autenticou o utilizador
            throw new AuthenticationError();
        }

        // 3. Converte o ID para número
        const userId = parseInt(userIdHeader, 10);
        if (isNaN(userId)) {
            throw new AppError("ID de utilizador inválido no cabeçalho.");
        }

        // 4. Usa o serviço para buscar os dados completos do utilizador
        const user = await this.userService.getUser(userId);

        // 5. Verifica se o utilizador realmente existe na base de dados
        if (!user) {
            // Este caso é raro se o middleware estiver a funcionar corretamente,
            // mas é uma boa verificação de segurança.
            throw new NotFoundError("User");
        }

        // 6. Retorna os dados do utilizador de forma segura (sem a senha)
        return user;

    }


    handlerError(error: unknown) {


        if (error instanceof AppError) {
            if (error.status === 204) {
                return new NextResponse(null, {status: 204});
            }
            return new NextResponse(error.message, {status: error.status});
        }

        // Se for um erro genérico do JavaScript, logamos e retornamos um erro 500.
        if (error instanceof Error) {
            console.error('Erro não tratado:', error.message);
        } else {
            // Se algo que não é um erro for "jogado" (throw)
            console.error('Um tipo de erro inesperado foi lançado:', error);
        }

        // Para todos os outros casos, retornamos um erro interno genérico.
        const internalError = new InternalError();
        return new NextResponse(internalError.message, {status: internalError.status});
    }
}