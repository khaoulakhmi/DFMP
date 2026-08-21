
import { Role } from '../../generated/prisma/enums';
import { User } from '../../generated/prisma/client'

export type PublicUser = Omit<User, 'password'>

// export interface User {
//     id: string;
//     name: string;
//     username: string;
//     password: string;
//     role: Role;
//     status: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface CreateUserDTO {
    name: string;
    username: string;
    password: string;
    role: Role;
    status?: boolean;
}

export interface UpdateUserDTO {
    name?: string;
    username?: string;
    status?: boolean;
    role?: Role;
}
