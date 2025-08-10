import {IUserRepository} from "@/app/api/repository/IUserRepository";
import {User} from "@/app/api/dominio/User";
import {PrismaClient} from "@/generated/prisma";
import {NotFoundError} from "@/app/api/errors/NotFoundError";
import {UserMapper} from "@/app/api/repository/mappers/UserMapper";

export class PrismaUserRepository implements IUserRepository {
    private prisma = new PrismaClient();

    private mapper = new UserMapper();

    async findById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {id}
        });

        if (!user) throw new NotFoundError('User id');

        return this.mapper.toDomain(user);
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {username}
        });

        if (!user) throw new NotFoundError('User username');

        return this.mapper.toDomain(user);
    }

    async updateUser(user: User): Promise<void> {
        const updateData = this.mapper.toUpdatePrisma(user);

        await this.prisma.user.update({
            where: {
                id: user.id!
            },
            data: updateData
        });
    }


}