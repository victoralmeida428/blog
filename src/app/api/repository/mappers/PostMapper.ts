import {IMapper} from "@/app/api/repository/mappers/IMapper";
import {Post as DomainPost} from "@/app/api/dominio/Post";
import {Post as PrismaPost, Prisma} from "@/generated/prisma";

type PrismaPostUpdate = Prisma.PostUpdateInput;
type PrismaPostCreate = Prisma.PostCreateInput;

export class PostMapper implements IMapper<DomainPost, PrismaPost, PrismaPostUpdate, PrismaPostCreate> {
    toUpdatePrisma(domain: DomainPost): Prisma.PostUpdateInput {
        return {
            title: domain.title,
            content: domain.content,
            published: domain.isPublished(),
            author: {
                connect: {
                    id: domain.authorId
                }
            }
        };
    }
    toCreatePrisma(domain: DomainPost): PrismaPostCreate {
        return {
            title: domain.title,
            content: domain.content,
            published: domain.isPublished(),
            author: {
                connect: {
                    id: domain.authorId
                }
            }
        };
    }
    toDomain(raw: PrismaPost): DomainPost {
        return DomainPost.reconstitute(
            {
                id: raw.id,
                title: raw.title,
                content: raw.content,
                isPublished: raw.published,
                createdAt: raw.createdAt,
                authorId: raw.authorId
            }
        );
    }


}
