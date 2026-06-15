import type { Lot } from "@/shared/types/lot.types"
import type { Product } from "@/shared/types/product.types"
import { SimpleGrid } from "@chakra-ui/react"
import { FiBriefcase, FiClipboard, FiFileText, FiPackage } from "react-icons/fi"
import { MetricCard } from "./lot-detail.components"
import type { SpecificationDetails } from "./lot-detail.types"

type Props = {
    lot: Lot
    spec: SpecificationDetails | null | undefined
    productCount: number
    marketCount: number
    invoiceCount: number
}

const LotDetailMetrics = ({ lot, spec, productCount, marketCount, invoiceCount }: Props) => (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} mb={7}>
        <MetricCard
            icon={<FiPackage />}
            label="Produits"
            value={String(productCount)}
            helper="dans ce lot"
        />
        <MetricCard
            icon={<FiClipboard />}
            label="Cahier de charge"
            value={spec ? `CDC-${String(spec.id).padStart(2, "0")}` : "-"}
            helper={spec ? `Annee ${spec.year}` : "Non assigne"}
        />
        <MetricCard
            icon={<FiBriefcase />}
            label="Marches"
            value={String(marketCount)}
            helper={marketCount ? "Approuve" : "Aucun marche"}
        />
        <MetricCard
            icon={<FiFileText />}
            label="Factures"
            value={String(invoiceCount)}
            helper={invoiceCount ? "ce marche" : "aucune facture"}
        />
    </SimpleGrid>
)

export default LotDetailMetrics