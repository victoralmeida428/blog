import {IPostRepository} from "@/app/api/repository/IPostRepository";
import {Prisma, PrismaClient} from "@/generated/prisma";
import {PostMapper} from "@/app/api/repository/mappers/PostMapper";
import {Post} from "@/app/api/dominio/Post";

export class PrismaPostRepository implements IPostRepository {
    private prisma = new PrismaClient();

    private mapper = new PostMapper();

    async create(post: Post): Promise<Post> {
        try {
            const createData = this.mapper.toCreatePrisma(post);
            const createdPrismaPost = await this.prisma.post.create({
                data: createData
            });
            return this.mapper.toDomain(createdPrismaPost);

        } catch (error) {
            if (error instanceof Prisma.PrismaClientUnknownRequestError) {
                throw new Error("Falha ao criar o post: o autor ou outra entidade relacionada não foi encontrada.")
            }
            console.error("Erro inesperado ao criar o Post: ", error);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.prisma.post.delete({
                where: {id},
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientUnknownRequestError) {
                throw new Error('Falha ao deletar o post: o autor ou outra entidade relacionada não foi encontrada.')
            }
            console.error("Erro inesperado ao deletar o Post: ", error);
            throw error;
        }
    }

    async findAll(): Promise<Post[]> {
        const prismaPost = await this.prisma.post.findMany({
            include: {
                author: true
            }
        });
        return prismaPost.map(post => this.mapper.toDomain(post));
    }

    async findById(id: number): Promise<Post | null> {
        const prismaPost = await this.prisma.post.findUnique({
            where: {id},
            include: {
                author: true
            }
        });

        if (!prismaPost) {
            return null;
        }

        return this.mapper.toDomain(prismaPost);
    }

    async update(post: Post): Promise<void> {
        const updateData = this.mapper.toUpdatePrisma(post);

        await this.prisma.post.update({
            where: {
                id: post.id!
            },
            data: updateData
        });

    }

}