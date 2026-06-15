import { productApi } from "@/api/product.api"
import Badge from "@/shared/components/atoms/badge"
import Button from "@/shared/components/atoms/button"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import Modal from "@/shared/components/molecules/modal"
import { toaster } from "@/shared/components/molecules/toast/toaster-instance"
import type { Product, TVA } from "@/shared/types/product.types"
import { Box, Flex, HStack, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FiBox, FiEdit2, FiExternalLink, FiFileText, FiMoreHorizontal, FiTrash2 } from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

const tvaLabels: Record<TVA, string> = {
    ZERO: "TVA 0%",
    NINE: "TVA 9%",
    NINETEEN: "TVA 19%",
}

const tvaRate = (tva: TVA) => tva === "NINETEEN" ? 0.19 : tva === "NINE" ? 0.09 : 0

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ["products", id],
        queryFn: () => productApi.getById(Number(id)),
        enabled: Boolean(id),
    })

    const deleteMutation = useMutation({
        mutationFn: () => productApi.delete(Number(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toaster.create({
                title: "Product deleted",
                description: `${product?.name ?? "Product"} has been deleted.`,
                type: "success",
            })
            navigate("/products")
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                type: "error",
            })
        },
    })

    if (isLoading) {
        return <Flex h="64" align="center" justify="center"><Spinner color="primary.500" /></Flex>
    }

    if (isError || !product) {
        return <Box p={6} bg="error.50" borderRadius="xl"><Text color="error.600">Product not found.</Text></Box>
    }

    const priceTtc = product.unitPrice * (1 + tvaRate(product.tva))
    const margin = product.unitPrice - product.providerPrice

    return (
        <Box p={{ base: 0, md: 6 }}>
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    if (!deleteMutation.isPending) setIsDeleteOpen(false)
                }}
                title="Delete Product"
                description="This action cannot be undone."
                confirmLabel="Delete"
                confirmVariant="danger"
                isConfirmLoading={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate()}
            >
                <Text fontSize="sm" color="neutral.700">
                    Delete {product.name}?
                </Text>
            </Modal>

            <BreadcrumbNavigation
                mb={4}
                items={[
                    { label: "Dashboard", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: product.name, isCurrentPage: true },
                ]}
            />

            <Box bg="white" border="1px solid" borderColor="neutral.200" borderRadius="xl" overflow="hidden" boxShadow="sm">
                <Flex
                    px={{ base: 4, md: 5 }}
                    py={4}
                    align={{ base: "stretch", sm: "center" }}
                    justify="space-between"
                    direction={{ base: "column", sm: "row" }}
                    gap={3}
                    borderBottom="1px solid"
                    borderColor="neutral.200"
                >
                    <HStack gap={4} align="flex-start">
                        <Flex w="12" h="12" align="center" justify="center" bg="success.50" color="success.700" borderRadius="md">
                            <FiBox size={24} />
                        </Flex>
                        <Box>
                            <HStack gap={2} wrap="wrap">
                                <Text fontSize="lg" fontWeight="bold" color="neutral.900">{product.name}</Text>
                                <Badge label={tvaLabels[product.tva]} variant="warning" tone="subtle" />
                            </HStack>
                            <Text fontSize="sm" color="neutral.700">
                                {product.lot?.name ?? `Lot ${product.lotId}`} - Designation: {product.designation?.name ?? product.designationId}
                            </Text>
                        </Box>
                    </HStack>
                    <Box color="neutral.500"><FiMoreHorizontal /></Box>
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} borderBottom="1px solid" borderColor="neutral.200">
                    {[
                        ["Unit", product.unit],
                        ["Unit price", `${product.unitPrice} DA`],
                        ["Provider price", `${product.providerPrice} DA`],
                        ["Evaluation price", `${product.evaluationPrice} DA`],
                    ].map(([label, value]) => (
                        <Box key={label} p={5} textAlign="center" borderEnd={{ md: "1px solid" }} borderBottom={{ base: "1px solid", sm: "0" }} borderColor="neutral.200">
                            <Text fontSize="xs" color="neutral.600">{label}</Text>
                            <Text mt={1} fontSize="lg" fontWeight="bold">{value}</Text>
                        </Box>
                    ))}
                </SimpleGrid>

                <Box p={5} borderBottom="1px solid" borderColor="neutral.200">
                    <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="semibold">Authorized quantity</Text>
                    </Flex>
                    <Box h="1.5" bg="neutral.100" borderRadius="full" position="relative">
                        <Box position="absolute" left="5%" right="8%" top="0" bottom="0" bg="success.700" borderRadius="full" />
                    </Box>
                    <Flex justify="space-between" mt={2}>
                        <Text fontSize="sm" fontWeight="semibold">Min<br />{product.quantityMin} {product.unit}</Text>
                        <Text fontSize="sm" fontWeight="semibold" textAlign="right">Max<br />{product.quantityMax} {product.unit}</Text>
                    </Flex>
                </Box>

                <VStack align="stretch" gap={3} p={5} borderBottom="1px solid" borderColor="neutral.200">
                    <Flex justify="space-between" gap={3} wrap="wrap"><Text>TVA applied</Text><Text fontWeight="bold">{tvaLabels[product.tva].replace("TVA ", "")}</Text></Flex>
                    <Flex justify="space-between" gap={3} wrap="wrap"><Text>Price TTC</Text><Text fontWeight="bold">{priceTtc.toFixed(2)} DA</Text></Flex>
                    <Flex justify="space-between" gap={3} wrap="wrap"><Text>Provider margin</Text><Text fontWeight="bold" color="success.700">+{margin.toFixed(2)} DA / {product.unit}</Text></Flex>
                    <Flex justify="space-between">
                        <Text>Parent lot</Text>
                        <HStack gap={1} color="primary.700">
                            <Text>{product.lot?.name ?? product.lotId}</Text>
                            <FiExternalLink />
                        </HStack>
                    </Flex>
                    <Flex justify="space-between">
                        <Text>Designation</Text>
                        <HStack gap={1} color="primary.700">
                            <Text>{product.designation?.name ?? product.designationId}</Text>
                            <FiExternalLink />
                        </HStack>
                    </Flex>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} p={5}>
                    <Button variant="secondary" onClick={() => navigate(`/products/${product.id}/edit`)}>
                        <HStack justify="center"><FiEdit2 /><Text>Edit</Text></HStack>
                    </Button>
                    <Button variant="secondary">
                        <HStack justify="center"><FiFileText /><Text>Related invoices</Text></HStack>
                    </Button>
                    <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                        <HStack justify="center"><FiTrash2 /></HStack>
                    </Button>
                </SimpleGrid>
            </Box>
        </Box>
    )
}

export default ProductDetailPage
