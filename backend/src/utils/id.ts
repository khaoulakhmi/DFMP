import { z } from 'zod'
import { invalidIdError } from './AppError'

// Upper bound of a Postgres INT column.
export const MAX_DB_INT = 2_147_483_647

// Integer ID as it arrives in a URL segment, e.g. "42".
export const intIdParamSchema = z.string()
    .regex(/^[1-9]\d*$/, 'ID must be a positive integer')
    .refine(value => Number(value) <= MAX_DB_INT, 'ID is too large')

// Integer ID sent in a JSON body, e.g. designationId: 42.
export const intIdSchema = z.number().int().positive().max(MAX_DB_INT)

export const cuidParamSchema = z.cuid('Invalid ID')

// `params` shapes for routes of the form "/:id".
export const intIdParams = z.object({ id: intIdParamSchema })
export const cuidParams = z.object({ id: cuidParamSchema })

export const intIdParamsSchema = z.object({ params: intIdParams })
export const cuidParamsSchema = z.object({ params: cuidParams })

// Controllers call these instead of Number(req.params.id). Routes already
// validate, so these only throw if a route is missing its validator.
export const parseIntIdParam = (value: unknown): number => {
    const result = intIdParamSchema.safeParse(value)
    if (!result.success) throw invalidIdError()
    return Number(result.data)
}

export const parseCuidParam = (value: unknown): string => {
    const result = cuidParamSchema.safeParse(value)
    if (!result.success) throw invalidIdError()
    return result.data
}
