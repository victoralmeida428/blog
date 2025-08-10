import {IMapper} from "@/app/api/repository/mappers/IMapper";
import {User as DomainUser} from "@/app/api/dominio/User";
import {Prisma, User as PrismaUser} from "@/generated/prisma";

type PrismaUserUpdate = Prisma.UserUpdateInput;
type PrismaUserCreate = Prisma.UserCreateInput;

export class UserMapper implements IMapper<DomainUser, PrismaUser, PrismaUserUpdate, PrismaUserCreate> {
    toCreatePrisma(domain: DomainUser): PrismaUserCreate {
        return undefined as unknown as PrismaUserCreate;
    }

    toDomain(raw: PrismaUser): DomainUser {
        return DomainUser.reconstitute({
            id: raw.id,
            username: raw.username,
            email: raw.email,
            name: raw.name!,
            isAdmin: true,
            password_hash: raw.password,
        });
    }

    toUpdatePrisma(domain: DomainUser): PrismaUserUpdate {
        return {
            password: domain.password_hash,
            name: domain.name,
            email: domain.email,
        };
    }

}