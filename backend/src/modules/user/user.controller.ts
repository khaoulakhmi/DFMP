import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./user.types";
import { hasErrorCode } from "../../utils/error";



export const UserController = {
    // Implement user-related request handling here
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch {
            console.error('Unexpected error while fetching users.');
            res.status(500).json({ error: 'Failed to fetch users....' });
        }
    },

    async getUserByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params as { username: string };
            const user = await UserService.getUserByUsername(username);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            res.json(user);
        } catch {
            console.error('Unexpected error while fetching a user by username.');
            res.status(500).json({ error: 'Failed to fetch user by username.' });
        }
    },

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const user = await UserService.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            res.json(user);
        } catch {
            console.error('Unexpected error while fetching a user by ID.');
            res.status(500).json({ error: 'Failed to fetch user by ID.' });
        }
    },

    async createUser(req: Request, res: Response) {
        try {
            const userData  = req.body;
            const newUser = await UserService.createUser(userData)
            res.status(201).json(newUser);
        }
        catch (error: unknown) {
                if (hasErrorCode(error, 'P2002')) {
                    return res.status(409).json({ error: 'Username already exists.' });
                }

                console.error('Unexpected error while creating a user.');
                res.status(500).json({ error: 'Failed to create user.' });
        }
    },

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const { name, username, role, status } = req.body;
            const updateData: UpdateUserDTO = { name, username, role, status };
            const updatedUser = await UserService.updateUser(id, updateData);
            res.json(updatedUser);
        } catch (error: unknown) {
            if (hasErrorCode(error, 'P2025')) {
                return res.status(404).json({ error: 'User not found.' });
            }
            if (hasErrorCode(error, 'P2002')) {
                return res.status(409).json({ error: 'Username already exists.' });
            }

            console.error('Unexpected error while updating a user.');
            res.status(500).json({ error: 'Failed to update user.' });
        }
    },

    async deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string } ;
        await UserService.deleteUser(id);
        res.status(204).send() // ✅ clean REST response
    } catch (error: unknown) {
        if (hasErrorCode(error, 'P2025')) {
            return res.status(404).json({ error: 'User not found.' })
        }

        console.error('Unexpected error while deleting a user.');
        res.status(500).json({ error: 'Failed to delete user.' });
    }
}
}
