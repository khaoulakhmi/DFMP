import z from "zod";

// The summary takes no parameters; anything sent is rejected.
export const getDashboardSummarySchema = z.object({
    query: z.object({}).strict(),
});
