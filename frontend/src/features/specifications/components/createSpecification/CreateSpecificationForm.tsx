import Button from "@/shared/components/atoms/button"
import Stepper from "@/shared/components/molecules/stepper"
import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import type { MouseEvent } from "react"
import type { UseFormHandleSubmit } from "react-hook-form"
import { FiSave } from "react-icons/fi"
import type { SpecificationForm } from "../specificationForm/types"
import type { buildCreateSpecificationSteps } from "./CreateSpecificationSteps"

type CreateSpecificationFormProps = {
    activeStep: number
    isPending: boolean
    onBack: () => void
    onContinue: (event: MouseEvent<HTMLButtonElement>) => void
    onGoBack: () => void
    onSubmit: (data: SpecificationForm) => void
    handleSubmit: UseFormHandleSubmit<SpecificationForm>
    steps: ReturnType<typeof buildCreateSpecificationSteps>
}

const CreateSpecificationForm = ({
    activeStep,
    isPending,
    onBack,
    onContinue,
    onGoBack,
    onSubmit,
    handleSubmit,
    steps,
}: CreateSpecificationFormProps) => (
    <Box
        as="form"
        bg="white"
        border="1px solid"
        borderColor="neutral.200"
        borderRadius="xl"
        boxShadow="sm"
        overflow="hidden"
        onSubmit={handleSubmit(onSubmit)}
    >
        <Box px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderBottom="1px solid" borderColor="neutral.200">
            <Text fontSize="sm" fontWeight="semibold" color="neutral.800">Specification administrative</Text>
            <Text fontSize="xs" color="neutral.500" mt={1}>All schema fields for Specifications and Tendering are available here.</Text>
        </Box>

        <Box px={{ base: 5, md: 8 }} py={6}>
            <Stepper
                key={activeStep}
                steps={steps}
                defaultStep={activeStep}
                showControls={false}
                size="sm"
                shape="circle"
                contentProps={{
                    border: "0",
                    boxShadow: "none",
                    p: 0,
                    mt: 6,
                }}
            />
        </Box>

        <Flex justify="space-between" gap={3} px={{ base: 5, md: 8 }} py={5} bg="neutral.50" borderTop="1px solid" borderColor="neutral.200" wrap="wrap">
            <Box w={{ base: "full", sm: "32" }}>
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isPending}
                    onClick={activeStep === 0 ? onBack : onGoBack}
                >
                    {activeStep === 0 ? "Cancel" : "Back"}
                </Button>
            </Box>
            <HStack gap={3} justify="flex-end" flex="1">
                <Box w={{ base: "full", sm: activeStep === steps.length - 1 ? "48" : "32" }}>
                    {activeStep === steps.length - 1 ? (
                        <Button type="submit" disabled={isPending}>
                            <HStack justify="center"><FiSave /><Text>{isPending ? "Creating..." : "Create specification"}</Text></HStack>
                        </Button>
                    ) : (
                        <Button type="button" disabled={isPending} onClick={onContinue}>
                            Continue
                        </Button>
                    )}
                </Box>
            </HStack>
        </Flex>
    </Box>
)

export default CreateSpecificationForm
