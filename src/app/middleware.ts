import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {PrismaUserRepository} from '@/app/api/repository/PrismaUserRepository';
import {PrismaSessionRepository} from '@/app/api/repository/PrismaSessionRepository';
import {AuthService} from "@/app/api/services/AuthServer";

// Inicializamos os serviços aqui.
// Nota: Em ambientes Edge, pode haver limitações com o Prisma.
// Esta abordagem funciona melhor com o runtime Node.js.
const userRepository = new PrismaUserRepository();
const sessionRepository = new PrismaSessionRepository();
const authService = new AuthService(userRepository, sessionRepository);

// A função principal do middleware
export async function middleware(request: NextRequest) {
    // 1. Obtém o ID da sessão a partir dos cookies da requisição
    const sessionId = request.cookies.get('session_id')?.value;

    // Se não houver ID de sessão, redireciona para a página de login
    if (!sessionId) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // 2. Valida a sessão usando o nosso AuthService
        const user = await authService.validateSession(sessionId);

        // Se a validação falhar (retornar null ou lançar erro), a sessão é inválida
        if (!user) {
            throw new Error('Sessão inválida');
        }

        // 3. Se a sessão for válida, permite que a requisição continue
        // Pode-se adicionar o utilizador aos cabeçalhos da requisição se necessário
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', user.id!.toString());

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        // 4. Se a sessão for inválida (expirada, não encontrada, etc.)
        // Redireciona para a página de login e remove o cookie inválido
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('session_id');
        return response;
    }
}

// O matcher define quais rotas serão protegidas por este middleware
export const config = {
    matcher: [
        /*
         * Corresponde a todos os caminhos de requisição, exceto para:
         * - /api/users/login (para permitir o login)
         * - /login (a própria página de login)
         * - Ficheiros estáticos (_next/static, _next/image, favicon.ico)
         */
        '/((?!api/users/login|login|_next/static|_next/image|favicon.ico).*)',
    ],
};
