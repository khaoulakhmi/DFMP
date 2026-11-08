import { designationApi } from "@/api/designation.api"
import type { Designation } from "@/shared/types/designation.types"
import EntitySelect, { type EntitySelectProps } from "./EntitySelect"

type DesignationSelectProps = Omit<
    EntitySelectProps<Designation>,
    "queryKey" | "fetchPage" | "fetchById" | "byIdQueryKey" | "getId" | "getLabel"
>

// Searchable designation picker; finds designations on any page.
const DesignationSelect = (props: DesignationSelectProps) => (
    <EntitySelect<Designation>
        {...props}
        queryKey={["designations"]}
        fetchPage={({ page, pageSize, search }) =>
            designationApi.list({ page, pageSize, search, sortBy: "name", sortOrder: "asc" })}
        fetchById={id => designationApi.getById(id)}
        byIdQueryKey={id => ["designations", String(id)]}
        getId={designation => designation.id}
        getLabel={designation => designation.name}
        getDescription={designation => designation.description ?? undefined}
    />
)

export default DesignationSelect
