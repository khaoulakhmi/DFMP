import { lotApi } from "@/api/lot.api"
import EntityMultiSelect from "@/shared/components/molecules/Forms/EntityMultiSelect"
import type { Lot } from "@/shared/types/lot.types"
import { Box, Text } from "@chakra-ui/react"
import { Controller, useWatch, type Control } from "react-hook-form"
import type { SpecificationForm } from "./types"

type LotCheckboxGridProps = {
    control: Control<SpecificationForm>
    // Lots already linked to the record being edited, for their labels.
    knownLots?: Lot[] | undefined
}

const productCount = (lot: Lot) => lot._count?.products ?? lot.products?.length ?? 0

/**
 * Lots of the selected designation, searched and paged on the server.
 * Selected lots stay selected (and visible as chips) even when they are not
 * on a loaded page or belong to another designation.
 */
const LotCheckboxGrid = ({ control, knownLots }: LotCheckboxGridProps) => {
    const designationId = Number(useWatch({ control, name: "designationId" })) || null

    if (!designationId) {
        return (
            <Box p={4} bg="neutral.50" borderRadius="md">
                <Text fontSize="sm" color="neutral.500">Select a designation with available lots.</Text>
            </Box>
        )
    }

    return (
        <Controller
            control={control}
            name="lotIds"
            render={({ field }) => (
                <EntityMultiSelect<Lot>
                    value={field.value ?? []}
                    onChange={field.onChange}
                    queryKey={["lots", "by-designation", designationId]}
                    fetchPage={({ page, pageSize, search }) =>
                        lotApi.list({ page, pageSize, search, designationId, sortBy: "name", sortOrder: "asc" })}
                    knownItems={knownLots}
                    getId={lot => lot.id}
                    getLabel={lot => lot.name}
                    getDescription={lot => {
                        const count = productCount(lot)
                        const linked = lot.specificationsId ? ` · cahier #${lot.specificationsId}` : ""
                        return `${count} product${count === 1 ? "" : "s"}${linked}`
                    }}
                    emptyLabel="No lots for this designation."
                />
            )}
        />
    )
}

export default LotCheckboxGrid
