import prisma from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { conflictError } from "./AppError";

export async function runSerializableTransaction<T>(
    work: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await prisma.$transaction(work, {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            });
        } catch (error) {
            const isWriteConflict =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034";

            if (!isWriteConflict) {
                throw error;
            }

            if (attempt === maxAttempts) {
                throw conflictError(
                    "CONCURRENT_MODIFICATION",
                    "The data changed during this operation. Please retry."
                );
            }
        }
    }

    throw new Error("Transaction attempts exhausted");
}