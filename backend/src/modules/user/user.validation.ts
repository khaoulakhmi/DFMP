import z from "zod";
import { Role } from "../../generated/prisma/enums";
import { cuidParams, cuidParamsSchema } from "../../utils/id";
import { booleanQuery, paginationQueryShape, sortOrderSchema } from "../../utils/pagination";

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
        params: cuidParams,
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

export const userIdSchema = cuidParamsSchema;

export const userListQuerySchema = z.object({
    ...paginationQueryShape,

    role: roleEnum.optional(),
    status: booleanQuery.optional(),

    sortBy: z
        .enum(["name", "username", "role", "createdAt"])
        .default("createdAt"),
    sortOrder: sortOrderSchema.default("desc"),
}).strict();

export const getUsersSchema = z.object({
    query: userListQuerySchema,
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
