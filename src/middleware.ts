import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {JWTPayload, jwtVerify} from 'jose';

// A função de verificação do JWT que corre no Edge
async function verifyAuth(token: string): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'default-secret-key');
        const {payload} = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}

// A função principal do middleware
export async function middleware(request: NextRequest) {
    // Verificamos se o método da requisição é um dos que queremos proteger.
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {

        const token = request.cookies.get('auth_token')?.value;
        console.log('token: ', token);
        if (!token) {
            return new NextResponse('Authentication required: No token provided', {status: 401});
        }

        const payload = await verifyAuth(token);

        if (!payload) {
            return new NextResponse('Authentication failed: Invalid token', {status: 401});
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.id as string);
        // Para todos os outros métodos (ex: GET), permite que a requisição continue sem verificação.
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

// O matcher agora define que este middleware deve correr para todas as rotas de API.
export const config = {
    matcher: '/api/:path*',
};
