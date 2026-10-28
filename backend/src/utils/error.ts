export const hasErrorMessage = (error: unknown, message: string): boolean => {
    return error instanceof Error && error.message === message
}
