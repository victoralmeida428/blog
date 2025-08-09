import {AppError} from "@/app/api/errors/AppError";
import {InternalError} from "@/app/api/errors/InternalError";
import {NextResponse} from "next/server";

export type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export abstract class AbstractController {

    async getID(context: RouteContext): Promise<number> {
        const {params} = context;
        const {id} = await params;
        const idInt = parseInt(id, 10);
        if (isNaN(idInt)) {
            throw new AppError("Not a valid id");
        }
        return idInt;
    }

    handlerError(error: unknown) {
        if (error instanceof AppError) {
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