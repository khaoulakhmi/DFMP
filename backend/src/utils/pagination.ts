import z from "zod";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;

export const positiveIntegerQuery = z
    .string()
    .regex(/^[1-9]\d*$/, "Must be a positive integer")
    .transform(Number)
    .pipe(z.number().int().positive().max(2147483647));

// "true" / "false" in a query string.
export const booleanQuery = z
    .enum(["true", "false"])
    .transform(value => value === "true");

export const sortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

// Shared by every list endpoint. Each module adds its own `sortBy`,
// `sortOrder` default and filters, then calls `.strict()` so unknown
// query parameters are rejected with 400.
export const paginationQueryShape = {
    page: positiveIntegerQuery.default(1),

    pageSize: positiveIntegerQuery
        .pipe(z.number().max(MAX_PAGE_SIZE))
        .default(DEFAULT_PAGE_SIZE),

    // Blank searches are treated as "no search".
    search: z
        .string()
        .trim()
        .max(100)
        .optional()
        .transform(value => (value ? value : undefined)),
};

export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export const pageToSkip = (page: number, pageSize: number) => (page - 1) * pageSize;

export function paginate<T>(
    data: T[],
    total: number,
    page: number,
    pageSize: number,
): PaginatedResponse<T> {
    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}
