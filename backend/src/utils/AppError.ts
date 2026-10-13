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