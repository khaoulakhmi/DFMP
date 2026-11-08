export type DashboardSummary = {
    users: { total: number; active: number }
    providers: { total: number }
    designations: { total: number }
    lots: { total: number; withSpecification: number; withoutSpecification: number }
    products: { total: number; withoutLot: number }
    specifications: { total: number }
}
