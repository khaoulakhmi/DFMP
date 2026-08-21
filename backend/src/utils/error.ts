export const hasErrorCode = (error: unknown, code: string): boolean => {
    return typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === code
}

export const hasErrorMessage = (error: unknown, message: string): boolean => {
    return error instanceof Error && error.message === message
}
