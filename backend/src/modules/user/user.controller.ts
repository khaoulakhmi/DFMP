import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./user.types";
import { AppError, notFoundError } from "../../utils/AppError";
import { parseCuidParam } from "../../utils/id";
import { createPrismaErrorMapper } from "../../utils/prismaError";

// Username is the only unique field on User.
const mapPrismaError = createPrismaErrorMapper("User", {
    duplicate: { code: "USERNAME_EXISTS", message: "Username already exists" },
});

export const UserController = {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    async getUserByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params as { username: string };
            const user = await UserService.getUserByUsername(username);
            // Non-admins get 403 for other users and for missing users alike,
            // so they can't probe which usernames exist.
            if (
                req.user.role !== "ADMIN" &&
                (!user || user.id !== req.user.id)
            ) {
                return next(new AppError({
                    statusCode: 403,
                    code: "FORBIDDEN",
                    message: "You do not have permission to access this resource.",
                }));
            }
            if (!user) {
                return next(notFoundError("User"));
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            const user = await UserService.getUserById(id);
            if (!user) {
                return next(notFoundError("User"));
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(mapPrismaError(error, "create"));
        }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            const { name, username, role, status } = req.body;
            const updateData: UpdateUserDTO = { name, username, role, status };
            const updatedUser = await UserService.updateUser(id, updateData);
            res.json(updatedUser);
        } catch (error) {
            next(mapPrismaError(error, "update"));
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseCuidParam(req.params.id);
            await UserService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            next(mapPrismaError(error, "delete"));
        }
    },
};
