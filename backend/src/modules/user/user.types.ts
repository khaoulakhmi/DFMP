
import { Role } from '../../generated/prisma/enums';

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
}

export interface UpdateUserDTO {
    name?: string;
    username?: string;
    password?: string;
    status?: boolean;
    role?: Role;
}

