import z from "zod";
import { Role } from "../../generated/prisma/enums";

const roleEnum = z.enum([Role.ADMIN, Role.SALES, Role.FINANCE, Role.ACCOUNTANT])

export const createUserSchema = z.object(
    { 
        body : z.object({
            name: z.string().trim().min(1, "Name is required"),
            username: z.string().trim().min(1, "Username is required"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
            role: roleEnum,
            status: z.boolean().optional()
        }).strict()
    }
)


export const updateUserSchema = z.object(
    {   
        params: z.object({
           id: z.cuid()       
        }),
        body : z.object({
            name: z.string().trim().min(1).optional(),
            username: z.string().trim().min(1).optional(),
            role: roleEnum.optional(),
            status: z.boolean().optional()
        }).strict().refine(
            (data) => Object.keys(data).length > 0,
            { message: "Provide at least one field to update" }
        )
    }
)
