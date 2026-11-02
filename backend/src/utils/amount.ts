import { z } from 'zod'

// Upper bound (exclusive) of a Postgres DECIMAL(20, 2) column: 18 digits before the point.
export const MAX_DECIMAL_20_2 = 1e18

// Money value sent in a JSON body, stored as DECIMAL(20, 2).
// Prisma accepts a number for Decimal columns; Postgres rounds it to 2 decimals.
export const amountSchema = z.number()
    .nonnegative('Amount cannot be negative')
    .lt(MAX_DECIMAL_20_2, 'Amount is too large')
