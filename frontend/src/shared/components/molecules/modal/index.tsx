import type { ReactNode } from "react"
import {
    Box,
    DialogBackdrop,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPositioner,
    DialogRoot,
    DialogTitle,
    HStack,
    Portal,
    Text,
} from "@chakra-ui/react"
import Button from "@/shared/components/atoms/button"

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full"
type ModalPlacement = "center" | "top" | "bottom"
type ModalButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "accent"

interface ModalProps {
    open: boolean
    onClose: () => void
    title: ReactNode
    description?: ReactNode
    children?: ReactNode
    footer?: ReactNode
    size?: ModalSize
    placement?: ModalPlacement
    closeOnInteractOutside?: boolean
    closeOnEscape?: boolean
    hideCloseButton?: boolean
    cancelLabel?: string
    confirmLabel?: string
    confirmVariant?: ModalButtonVariant
    isConfirmLoading?: boolean
    isConfirmDisabled?: boolean
    onConfirm?: () => void
}

const Modal = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
    placement = "center",
    closeOnInteractOutside = true,
    closeOnEscape = true,
    hideCloseButton = false,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    confirmVariant = "primary",
    isConfirmLoading = false,
    isConfirmDisabled = false,
    onConfirm,
}: ModalProps) => {
    const hasDefaultFooter = Boolean(onConfirm)
    const hasFooter = Boolean(footer || hasDefaultFooter)

    return (
        <DialogRoot
            open={open}
            onOpenChange={(details) => {
                if (!details.open) onClose()
            }}
            size={size}
            placement={placement}
            closeOnInteractOutside={closeOnInteractOutside}
            closeOnEscape={closeOnEscape}
            lazyMount
            unmountOnExit
        >
            <Portal>
                <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(2px)" />
                <DialogPositioner px={{ base: 4, md: 6 }}>
                    <DialogContent
                        bg="white"
                        borderRadius={size === "full" ? "0" : "xl"}
                        border="1px solid"
                        borderColor="neutral.200"
                        boxShadow="xl"
                        overflow="hidden"
                    >
                        <DialogHeader
                            px={{ base: 5, md: 6 }}
                            py={5}
                            bg="neutral.50"
                            borderBottom="1px solid"
                            borderColor="neutral.200"
                            pe={hideCloseButton ? undefined : 12}
                        >
                            <DialogTitle asChild>
                                <Text fontSize="lg" fontWeight="semibold" color="neutral.900">
                                    {title}
                                </Text>
                            </DialogTitle>
                            {description && (
                                <DialogDescription asChild>
                                    <Text mt={1} fontSize="sm" color="neutral.500">
                                        {description}
                                    </Text>
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        {!hideCloseButton && (
                            <DialogCloseTrigger
                                top={4}
                                insetEnd={4}
                                w="8"
                                h="8"
                                borderRadius="md"
                                color="neutral.500"
                                bg="transparent"
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="lg"
                                _hover={{ bg: "neutral.100", color: "neutral.900" }}
                            >
                                <Box as="span" lineHeight="1">x</Box>
                            </DialogCloseTrigger>
                        )}

                        <DialogBody px={{ base: 5, md: 6 }} py={6}>
                            {children}
                        </DialogBody>

                        {hasFooter && (
                            <DialogFooter
                                px={{ base: 5, md: 6 }}
                                py={4}
                                bg="neutral.50"
                                borderTop="1px solid"
                                borderColor="neutral.200"
                            >
                                {footer ?? (
                                    <HStack gap={3} justify="flex-end" w="full" wrap="wrap">
                                        <Box w={{ base: "full", sm: "32" }}>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="md"
                                                disabled={isConfirmLoading}
                                                onClick={onClose}
                                            >
                                                {cancelLabel}
                                            </Button>
                                        </Box>
                                        <Box w={{ base: "full", sm: "40" }}>
                                            <Button
                                                type="button"
                                                variant={confirmVariant}
                                                size="md"
                                                disabled={isConfirmDisabled || isConfirmLoading}
                                                onClick={onConfirm}
                                            >
                                                {isConfirmLoading ? "Please wait..." : confirmLabel}
                                            </Button>
                                        </Box>
                                    </HStack>
                                )}
                            </DialogFooter>
                        )}
                    </DialogContent>
                </DialogPositioner>
            </Portal>
        </DialogRoot>
    )
}

export type { ModalProps }
export default Modal
