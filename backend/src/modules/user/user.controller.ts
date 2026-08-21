import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UpdateUserDTO } from "./user.types";



export const UserController = {
    // Implement user-related request handling here
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        } catch (error) {
            console.error('Error fetching user by username:', error);
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
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ error: 'Failed to fetch user by ID.' });
        }
    },

    async createUser(req: Request, res: Response) {
        try {
            const userData  = req.body;
            const newUser = await UserService.createUser(userData)
            res.status(201).json(newUser);
        }
        catch (error: any) {
                if (error?.code === 'P2002') {
                    return res.status(409).json({ error: 'Username already exists.' });
                }

                console.error('Error creating user:', error);
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
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user.' });
        }
    },

    async deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params as { id: string } ;
        await UserService.deleteUser(id);
        res.status(204).send() // ✅ clean REST response
    } catch (error: any) {
        console.error('Error deleting user:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' })
        }

        res.status(500).json({ error: 'Failed to delete user.' });
    }
}
}
