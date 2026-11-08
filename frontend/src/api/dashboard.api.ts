import type { DashboardSummary } from "@/shared/types/dashboard.types"
import api from "./axios"

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummary> => {
        const { data } = await api.get<DashboardSummary>("/dashboard/summary")
        return data
    },
}
