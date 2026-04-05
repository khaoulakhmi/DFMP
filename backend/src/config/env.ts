const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN'
] as const

for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
}

export const env = {
    databaseUrl:            process.env.DATABASE_URL!,
    accessTokenSecret:      process.env.ACCESS_TOKEN_SECRET!,
    refreshTokenSecret:     process.env.REFRESH_TOKEN_SECRET!,
    accessTokenExpiresIn:   process.env.ACCESS_TOKEN_EXPIRES_IN!,
    refreshTokenExpiresIn:  process.env.REFRESH_TOKEN_EXPIRES_IN!,
}