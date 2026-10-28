type AppErrorOptions = {
    statusCode: number
    code: string
    message: string
}

export class AppError extends Error {
    readonly statusCode: number
    readonly code: string

    constructor({ statusCode, code, message }: AppErrorOptions) {
        super(message)

        this.name = 'AppError'
        this.statusCode = statusCode
        this.code = code
    }
}

// "Product" -> "PRODUCT", "Purchase order" -> "PURCHASE_ORDER"
const toErrorCode = (resource: string) => resource.trim().replace(/\s+/g, '_').toUpperCase()

export const notFoundError = (resource: string) => new AppError({
    statusCode: 404,
    code: `${toErrorCode(resource)}_NOT_FOUND`,
    message: `${resource} not found`,
})

export const conflictError = (code: string, message: string) => new AppError({
    statusCode: 409,
    code,
    message,
})

export const invalidIdError = () => new AppError({
    statusCode: 400,
    code: 'INVALID_ID',
    message: 'Invalid ID',
})

export const invalidReferenceError = () => new AppError({
    statusCode: 400,
    code: 'INVALID_REFERENCE',
    message: 'A referenced record does not exist',
})

export const resourceInUseError = (resource: string) => conflictError(
    `${toErrorCode(resource)}_IN_USE`,
    `${resource} is still referenced by other records`,
)

export const alreadyExistsError = (resource: string) => conflictError(
    `${toErrorCode(resource)}_ALREADY_EXISTS`,
    `${resource} already exists`,
)
