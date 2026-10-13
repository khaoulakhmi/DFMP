import pino from 'pino'

export const logger = pino({
    level: 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
})