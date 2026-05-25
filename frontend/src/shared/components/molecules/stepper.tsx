import type React from "react"
import { Box, ButtonGroup, Flex, HStack, Steps, Text } from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"

export type StepperOrientation = "horizontal" | "vertical"
export type StepperVariant = "solid" | "subtle"
export type StepperSize = "xs" | "sm" | "md" | "lg"
export type StepperShape = "circle" | "rounded" | "square"
export type StepperControlsPlacement = "start" | "end" | "between"

export interface StepperItem {
    title: string
    description?: React.ReactNode
    content?: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
}

interface StepperProps
    extends Omit<
        React.ComponentProps<typeof Steps.Root>,
        "children" | "count" | "orientation" | "size" | "variant"
    > {
    steps: StepperItem[]
    orientation?: StepperOrientation
    variant?: StepperVariant
    size?: StepperSize
    shape?: StepperShape
    showDescription?: boolean
    showContent?: boolean
    showControls?: boolean
    showStepNumber?: boolean
    allowStepClick?: boolean
    completedContent?: React.ReactNode
    prevLabel?: string
    nextLabel?: string
    controlsPlacement?: StepperControlsPlacement
    contentProps?: React.ComponentProps<typeof Box>
    listProps?: React.ComponentProps<typeof Steps.List>
}

const shapeStyles: Record<StepperShape, { borderRadius: string }> = {
    circle: { borderRadius: "full" },
    rounded: { borderRadius: "md" },
    square: { borderRadius: "sm" },
}

const sizeStyles: Record<StepperSize, {
    indicatorSize: string
    titleSize: string
    descriptionSize: string
    gap: string
}> = {
    xs: {
        indicatorSize: "6",
        titleSize: "xs",
        descriptionSize: "2xs",
        gap: "2",
    },
    sm: {
        indicatorSize: "7",
        titleSize: "sm",
        descriptionSize: "xs",
        gap: "2.5",
    },
    md: {
        indicatorSize: "9",
        titleSize: "sm",
        descriptionSize: "xs",
        gap: "3",
    },
    lg: {
        indicatorSize: "11",
        titleSize: "md",
        descriptionSize: "sm",
        gap: "3.5",
    },
}

const StepIndicator = ({
    step,
    index,
    size,
    shape,
    showStepNumber,
}: {
    step: StepperItem
    index: number
    size: StepperSize
    shape: StepperShape
    showStepNumber: boolean
}) => {
    const sizes = sizeStyles[size]

    return (
        <Steps.Indicator
            w={sizes.indicatorSize}
            h={sizes.indicatorSize}
            minW={sizes.indicatorSize}
            borderWidth="1px"
            borderColor="neutral.300"
            bg="white"
            color="neutral.600"
            fontWeight="semibold"
            transition="all 0.2s ease"
            _current={{
                bg: "primary.600",
                borderColor: "primary.600",
                color: "white",
                boxShadow: "0 0 0 3px var(--chakra-colors-primary-100)",
            }}
            _complete={{
                bg: "success.500",
                borderColor: "success.500",
                color: "white",
            }}
            {...shapeStyles[shape]}
        >
            {step.icon ?? (showStepNumber ? index + 1 : null)}
        </Steps.Indicator>
    )
}

const StepText = ({
    step,
    size,
    showDescription,
}: {
    step: StepperItem
    size: StepperSize
    showDescription: boolean
}) => {
    const sizes = sizeStyles[size]

    return (
        <Box minW="0">
            <Steps.Title
                fontSize={sizes.titleSize}
                fontWeight="semibold"
                color="neutral.900"
                lineHeight="1.2"
            >
                {step.title}
            </Steps.Title>
            {showDescription && step.description && (
                <Steps.Description
                    asChild
                    color="neutral.500"
                    fontSize={sizes.descriptionSize}
                    mt={1}
                    lineHeight="1.35"
                >
                    <Text>{step.description}</Text>
                </Steps.Description>
            )}
        </Box>
    )
}

const getControlsJustify = (placement: StepperControlsPlacement) => {
    if (placement === "start") return "flex-start"
    if (placement === "between") return "space-between"
    return "flex-end"
}

const Stepper = ({
    steps,
    orientation = "horizontal",
    variant = "solid",
    size = "md",
    shape = "circle",
    showDescription = true,
    showContent = true,
    showControls = true,
    showStepNumber = true,
    allowStepClick = false,
    completedContent = "All steps are complete.",
    prevLabel = "Prev",
    nextLabel = "Next",
    controlsPlacement = "end",
    contentProps,
    listProps,
    defaultStep = 0,
    ...rootProps
}: StepperProps) => {
    const sizes = sizeStyles[size]
    const isVertical = orientation === "vertical"

    return (
        <Steps.Root
            count={steps.length}
            defaultStep={defaultStep}
            orientation={orientation}
            variant={variant}
            size={size}
            width="full"
            {...rootProps}
        >
            <Steps.List
                alignItems={isVertical ? "stretch" : "flex-start"}
                gap={isVertical ? "3" : sizes.gap}
                width="full"
                {...listProps}
            >
                {steps.map((step, index) => {
                    const label = (
                        <HStack
                            align="flex-start"
                            gap={sizes.gap}
                            opacity={step.disabled ? 0.55 : 1}
                            minW="0"
                        >
                            <StepIndicator
                                step={step}
                                index={index}
                                size={size}
                                shape={shape}
                                showStepNumber={showStepNumber}
                            />
                            <StepText
                                step={step}
                                size={size}
                                showDescription={showDescription}
                            />
                        </HStack>
                    )

                    return (
                        <Steps.Item
                            key={`${step.title}-${index}`}
                            index={index}
                            title={step.title}
                            pointerEvents={step.disabled ? "none" : "auto"}
                        >
                            {allowStepClick ? (
                                <Steps.Trigger
                                    display="block"
                                    textAlign="left"
                                    disabled={step.disabled}
                                >
                                    {label}
                                </Steps.Trigger>
                            ) : label}
                            <Steps.Separator bg="neutral.200" />
                        </Steps.Item>
                    )
                })}
            </Steps.List>

            {showContent && (
                <Box
                    mt={isVertical ? 5 : 6}
                    p={{ base: 4, md: 5 }}
                    bg="white"
                    border="1px solid"
                    borderColor="neutral.200"
                    borderRadius="lg"
                    boxShadow="sm"
                    {...contentProps}
                >
                    {steps.map((step, index) => (
                        <Steps.Content key={`${step.title}-content-${index}`} index={index}>
                            {step.content ?? step.description}
                        </Steps.Content>
                    ))}
                    <Steps.CompletedContent>
                        {completedContent}
                    </Steps.CompletedContent>
                </Box>
            )}

            {showControls && (
                <Flex mt={5} justify={getControlsJustify(controlsPlacement)}>
                    <ButtonGroup size="sm" variant="outline">
                        <Steps.PrevTrigger asChild>
                            <Button variant="secondary" size="sm">
                                {prevLabel}
                            </Button>
                        </Steps.PrevTrigger>
                        <Steps.NextTrigger asChild>
                            <Button variant="primary" size="sm">
                                {nextLabel}
                            </Button>
                        </Steps.NextTrigger>
                    </ButtonGroup>
                </Flex>
            )}
        </Steps.Root>
    )
}

export default Stepper
