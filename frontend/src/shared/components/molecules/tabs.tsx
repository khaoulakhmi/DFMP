import type React from "react";
import { Box, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@chakra-ui/react";


interface TabOption {
    icon?: React.ReactNode;
    label: string;
    value: string;
    content: React.ReactNode;
}

type TabsVariant = "segmented" | "underline";

interface TabsProps extends Omit<React.ComponentProps<typeof TabsRoot>, "variant"> {
    options: TabOption[];
    defaultValue?: string;
    variant?: TabsVariant;
}

const Tabs = ({ options, defaultValue, variant = "segmented", ...props }: TabsProps) => {
    const isUnderline = variant === "underline";

    return (
        <TabsRoot
            width="full"
            defaultValue={defaultValue}
            {...props}
        >
            <TabsList
                alignItems="center"
                bg={isUnderline ? "transparent" : "neutral.100"}
                borderWidth={isUnderline ? "0" : "1px"}
                borderBottomWidth="1px"
                borderColor="border.default"
                borderRadius={isUnderline ? "0" : "lg"}
                display="inline-flex"
                flexWrap="wrap"
                gap={isUnderline ? "6" : "1"}
                p={isUnderline ? "0" : "1"}
                width={isUnderline ? "full" : { base: "full", md: "fit-content" }}
            >
                {options.map((option) => (
                    <TabsTrigger
                        key={option.value}
                        value={option.value}
                        alignItems="center"
                        borderWidth={isUnderline ? "0" : "1px"}
                        borderBottomWidth={isUnderline ? "2px" : "1px"}
                        borderColor="transparent"
                        borderRadius={isUnderline ? "0" : "md"}
                        color="text.secondary"
                        display="inline-flex"
                        flex={isUnderline ? "0 0 auto" : { base: "1 1 100%", sm: "1 1 auto" }}
                        fontSize="sm"
                        fontWeight={isUnderline ? "semibold" : "medium"}
                        gap="2"
                        justifyContent="center"
                        minH="10"
                        px={isUnderline ? "1" : "4"}
                        py={isUnderline ? "3" : "2"}
                        position="relative"
                        transition="all 0.2s ease"
                        whiteSpace="nowrap"
                        _hover={
                            isUnderline
                                ? {
                                    // borderBottomColor: "accent.300",
                                    color: "text.primary",
                                }
                                : {
                                    bg: "bg.card",
                                    borderColor: "neutral.200",
                                    color: "text.primary",
                                }
                        }
                        _selected={
                            isUnderline
                                ? {
                                    // borderBottomColor: "accent.500",
                                    color: "accent.600",
                                }
                                : {
                                    bg: "bg.card",
                                    // borderColor: "accent.200",
                                    boxShadow: "md",
                                    color: "accent.600",
                                }
                        }
                        _focusVisible={{
                            boxShadow: "0 0 0 3px var(--chakra-colors-accent-100)",
                            outline: "none",
                        }}
                    >
                        {option.icon && (
                            <Box as="span" color="currentColor" fontSize="md">
                                {option.icon}
                            </Box>
                        )}
                        {option.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {options.map((option) => (
                <TabsContent
                    key={option.value}
                    value={option.value}
                    bg={isUnderline ? "transparent" : "bg.card"}
                    borderWidth={isUnderline ? "0" : "1px"}
                    borderColor="border.default"
                    borderRadius={isUnderline ? "0" : "lg"}
                    boxShadow={isUnderline ? "none" : "sm"}
                    mt={isUnderline ? "5" : "6"}
                    outline="none"
                    p={isUnderline ? "0" : { base: "4", md: "5" }}
                    _focusVisible={{
                        borderRadius: isUnderline ? "md" : "lg",
                        boxShadow: "0 0 0 3px var(--chakra-colors-accent-100)",
                    }}
                >
                    {option.content}
                </TabsContent>
            ))}
        </TabsRoot>
    )
}


export default Tabs;
