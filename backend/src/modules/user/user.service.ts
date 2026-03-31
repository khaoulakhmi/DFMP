import prisma from "../../config/prisma";
import { User } from '../../generated/prisma/client' // 👈 Prisma's User
import { CreateUserDTO, UpdateUserDTO } from "./user.types";
import { hashPassword } from "../../utils/hash";

export const UserService = {
    async getAllUsers(): Promise<User[]> {
        return await prisma.user.findMany(); // ✅ same type now
    },

    async getUserByUsername (username: string): Promise<User | null>{
        return await prisma.user.findUnique({ where: { username } });
    }, 

    async getUserById (id: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } });
    },

    async createUser (data: CreateUserDTO): Promise<User> {
        const hashedPassword = await hashPassword(data.password);
        return await prisma.user.create({ data: { ...data, password: hashedPassword } });
    },

    async updateUser (id: string, data: UpdateUserDTO): Promise<User> {
        return await prisma.user.update({ where: { id }, data });
    },

    async deleteUser (id: string): Promise<User> {
        return await prisma.user.delete({ where: { id } });
    }
}