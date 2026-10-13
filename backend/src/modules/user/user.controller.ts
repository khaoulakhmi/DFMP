import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./user.types";
import { hasErrorCode } from "../../utils/error";
import { AppError } from '../../utils/AppError'


export const UserController = {
    // Implement user-related request handling here
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error: unknown) {
            next(error)
        }
    },

    async getUserByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params as { username: string };
            const user = await UserService.getUserByUsername(username);
            if (
                req.user.role !== 'ADMIN' &&
                (!user || user.id !== req.user.id)
            ) {
                return next(new AppError({
                    statusCode: 403,
                    code: 'FORBIDDEN', 
                    message: 'You do not have permission to access this resource.',
                }));
            }
            if (!user) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found.',
                }));
            }
            res.json(user);
        } 
        catch (error: unknown) {
            next(error)
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string };
            const user = await UserService.getUserById(id);
            if (!user) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found.',
                }));
            }
            res.json(user);
        } 
        catch (error: unknown) {
    next(error)
}
    },

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData  = req.body;
            const newUser = await UserService.createUser(userData)
            res.status(201).json(newUser);
        }
        catch (error: unknown) {
            if (hasErrorCode(error, 'P2002')) {
                return next(new AppError({
                    statusCode: 409,
                    code: 'USERNAME_EXISTS',
                    message: 'Username already exists',
                }))
            }

            next(error)
        }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string };
            const { name, username, role, status } = req.body;
            const updateData: UpdateUserDTO = { name, username, role, status };
            const updatedUser = await UserService.updateUser(id, updateData);
            res.json(updatedUser);
        } 
        catch (error: unknown) {
            if (hasErrorCode(error, 'P2025')) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found',
                }))
            }

            if (hasErrorCode(error, 'P2002')) {
                return next(new AppError({
                    statusCode: 409,
                    code: 'USERNAME_EXISTS',
                    message: 'Username already exists',
                }))
            }

            next(error)
        }
    },

    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params as { id: string }
            await UserService.deleteUser(id)
            res.status(204).send()
        } catch (error: unknown) {
            if (hasErrorCode(error, 'P2025')) {
                return next(new AppError({
                    statusCode: 404,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found',
                }))
            }

            next(error)
        }
    }
}
