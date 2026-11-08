import prisma from "../../config/prisma";
import { CreateUserDTO, UpdateUserDTO, PublicUser } from "./user.types";
import { hashPassword } from "../../utils/hash";
import { userSelect } from "./user.select";
import type { Prisma } from "../../generated/prisma/client";
import { pageToSkip, paginate, type PaginatedResponse } from "../../utils/pagination";
import type { UserListQuery } from "./user.validation";

export const UserService = {
    async getAllUsers(query: UserListQuery): Promise<PaginatedResponse<PublicUser>> {
        const { page, pageSize, search, role, status, sortBy, sortOrder } = query;

        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { username: { contains: search, mode: "insensitive" } },
            ];
        }

        if (role !== undefined) {
            where.role = role;
        }

        if (status !== undefined) {
            where.status = status;
        }

        const orderBy: Prisma.UserOrderByWithRelationInput[] = [
            { [sortBy]: sortOrder },
            { id: "asc" },
        ];

        const [data, total] = await prisma.$transaction(
            [
                // userSelect never includes the password hash.
                prisma.user.findMany({
                    where,
                    orderBy,
                    skip: pageToSkip(page, pageSize),
                    take: pageSize,
                    select: userSelect,
                }),
                prisma.user.count({ where }),
            ],
            { isolationLevel: "RepeatableRead" },
        );

        return paginate<PublicUser>(data, total, page, pageSize);
    },

    async getUserByUsername (username: string): Promise<PublicUser | null>{
        return await prisma.user.findUnique({ where: { username }, select: userSelect });
    }, 

    async getUserById (id: string): Promise<PublicUser | null> {
        return await prisma.user.findUnique({ where: { id }, select: userSelect });
    },

    async createUser (data: CreateUserDTO): Promise<PublicUser> {
        const hashedPassword = await hashPassword(data.password);
        return await prisma.user.create({ data: { ...data, password: hashedPassword }, select: userSelect });
    },

    async updateUser (id: string, data: UpdateUserDTO): Promise<PublicUser> {
        const updateData: UpdateUserDTO = {
            name: data.name,
            username: data.username,
            role: data.role,
            status: data.status,
        };

        return await prisma.user.update({ where: { id }, data: updateData, select: userSelect });
    },

    async deleteUser (id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
    }
}
