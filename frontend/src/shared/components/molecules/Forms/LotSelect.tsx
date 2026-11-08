import { lotApi } from "@/api/lot.api"
import type { Lot } from "@/shared/types/lot.types"
import EntitySelect, { type EntitySelectProps } from "./EntitySelect"

type LotSelectProps = Omit<
    EntitySelectProps<Lot>,
    "queryKey" | "fetchPage" | "fetchById" | "byIdQueryKey" | "getId" | "getLabel"
> & {
    // Only offer lots of this designation.
    designationId?: number | null
}

// Searchable lot picker; finds lots on any page.
const LotSelect = ({ designationId, ...props }: LotSelectProps) => (
    <EntitySelect<Lot>
        {...props}
        queryKey={["lots", "by-designation", designationId ?? "all"]}
        fetchPage={({ page, pageSize, search }) =>
            lotApi.list({
                page,
                pageSize,
                search,
                sortBy: "name",
                sortOrder: "asc",
                ...(designationId ? { designationId } : {}),
            })}
        fetchById={id => lotApi.getById(id)}
        byIdQueryKey={id => ["lots", String(id)]}
        getId={lot => lot.id}
        getLabel={lot => lot.name}
        getDescription={lot => lot.designation?.name}
    />
)

export default LotSelect
