import {AbstractController} from "@/app/api/controller/AbsctractController";
import {UserService} from "@/app/api/services/UserSevice";
import {NextRequest, NextResponse} from "next/server";
import {AuthService} from "@/app/api/services/AuthServer";

export class UserController extends AbstractController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
    ) {
        super(userService);
    }

    /**
     * Autentica um usuario e salva a sessão
     * @param request
     */
    async login(request: NextRequest) {
        try {
            const body = await request.json();
            if (!body.username || !body.password) {
                return new NextResponse('Username and password are required', {status: 400});
            }

            // 1. UserService verifica as credenciais
            const user = await this.userService.login(body.username, body.password);

            //2. AuthService cria a sessão
            const session = await this.authService.createSession(user);

            const response = NextResponse.json({
                message: 'Login successfull'
            });

            response.cookies.set('session_id', session.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                expires: session.expiresAt,
                sameSite: 'lax'
            })

            return response;
        } catch (error) {
            return this.handlerError(error);
        }
    }

    /**
     * Efetua o logout do utilizador, destruindo a sessão.
     * Rota: POST /api/users/logout
     * @param request
     */
    async logout(request: NextRequest) {
        try {
            const sessionId = request.cookies.get('session_id')?.value;
            if (sessionId) {
                // Destrói a sessão na base de dados
                await this.authService.destroySession(sessionId);
            }

            // Cria uma resposta e remove o cookie do browser
            const response = NextResponse.json({message: 'Logout successful'});
            response.cookies.delete('session_id');

            return response;

        } catch (error) {
            return this.handlerError(error);
        }
    }

    /**
     * Altera a senha de um utilizador autenticado.
     * Rota: PUT /api/users/change-password (protegida por middleware)
     * @param request
     */
    async changePassword(request: NextRequest) {
        try {
            // O ID do utilizador é obtido de forma segura a partir do cabeçalho
            // que o nosso middleware de autenticação adicionou.
            const userIdHeader = request.headers.get('x-user-id');
            if (!userIdHeader) {
                return new NextResponse("Utilizador não autenticado.", {status: 401});
            }
            const userId = parseInt(userIdHeader, 10);

            const body = await request.json();
            if (!body.newPassword) {
                throw new NextResponse("Nova senha é obrigatória.", {status: 401});
            }

            const user = await this.userService.getUser(userId);

            await this.userService.changePassword(user.username, body.newPassword);

            // Retorna uma resposta de sucesso sem conteúdo
            return new NextResponse("Senha atualizada com sucesso", {status: 200});

        } catch (error) {
            return this.handlerError(error);
        }
    }
}