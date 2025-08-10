import {ISessionRepository} from "@/app/api/repository/ISessionRepository";
import {Session} from "@/app/api/dominio/Session";
import {SessionMapper} from "@/app/api/repository/mappers/SessionMapper";
import {Prisma, PrismaClient} from "@/generated/prisma";
import {NotFoundError} from "@/app/api/errors/NotFoundError";

export class PrismaSessionRepository implements ISessionRepository {
    private prisma = new PrismaClient();
    private mapper = new SessionMapper();

    async create(session: Session): Promise<Session> {
        try {
            const createData = this.mapper.toCreatePrisma(session);
            const createdPrismaSession = await this.prisma.session.create({
                data: createData
            });
            return this.mapper.toDomain(createdPrismaSession);

        } catch (error) {
            if (error instanceof Prisma.PrismaClientUnknownRequestError) {
                throw new Error("Falha ao criar o post: o autor ou outra entidade relacionada não foi encontrada.")
            }
            console.error("Erro inesperado ao criar o Post: ", error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        await this.prisma.session.delete({
            where: {id}
        })
    }

    async findById(id: string): Promise<Session> {
        const raw = await this.prisma.session.findUnique({where: {id}});

        if (!raw) throw new NotFoundError('Session');

        return this.mapper.toDomain(raw);
    }

}