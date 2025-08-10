import {IMapper} from "@/app/api/repository/mappers/IMapper";

import {Prisma, Session as PrismaSession} from "@/generated/prisma";
import {Session as DomainSession} from "@/app/api/dominio/Session";

type PrismaSessionUpdate = Prisma.SessionUpdateInput;
type PrismaSessionCreate = Prisma.SessionCreateInput;

export class SessionMapper implements IMapper<DomainSession, PrismaSession, PrismaSessionUpdate, PrismaSessionCreate> {
    toCreatePrisma(domain: DomainSession): PrismaSessionCreate {
        return {
            id: domain.id,
            expiresAt: domain.expiresAt,
            user: {
                connect: {
                    id: domain.userId,
                }
            }
        };
    }

    toDomain(raw: PrismaSession): DomainSession {
        return DomainSession.reconstitute({
            id: raw.id,
            userId: raw.userId,
            expiresAt: raw.expiresAt,
        });
    }

    toUpdatePrisma(domain: DomainSession): PrismaSessionUpdate {
        return {
            expiresAt: domain.expiresAt,
        };
    }

}