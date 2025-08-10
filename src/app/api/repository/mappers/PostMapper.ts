import {IMapper} from "@/app/api/repository/mappers/IMapper";
import {Post as DomainPost} from "@/app/api/dominio/Post";
import {Post as PrismaPost, Prisma, User as PrismaUser} from "@/generated/prisma";
import {User as DomainUser} from "@/app/api/dominio/User";
import {UserMapper} from "@/app/api/repository/mappers/UserMapper";

type PrismaPostUpdate = Prisma.PostUpdateInput;
type PrismaPostCreate = Prisma.PostCreateInput;
type PrismaPostWithAuthor = PrismaPost & { author?: PrismaUser };

export class PostMapper implements IMapper<DomainPost, PrismaPost, PrismaPostUpdate, PrismaPostCreate> {

    private readonly userMapper = new UserMapper();


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

    toDomain(raw: PrismaPostWithAuthor): DomainPost {
        let autor: DomainUser | null = null;
        if (raw.author) {
            autor = this.userMapper.toDomain(raw.author);
        }
        return DomainPost.reconstitute(
            {
                id: raw.id,
                title: raw.title,
                content: raw.content,
                isPublished: raw.published,
                createdAt: raw.createdAt,
                authorId: raw.authorId,
                author: autor
            }
        );
    }


}
