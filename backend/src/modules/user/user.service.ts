import prisma from "../../config/prisma";
import { CreateUserDTO, UpdateUserDTO, PublicUser } from "./user.types";
import { hashPassword } from "../../utils/hash";
import { userSelect } from "./user.select";

export const UserService = {
    async getAllUsers(): Promise<PublicUser[]> {
        return await prisma.user.findMany({ select: userSelect });
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
