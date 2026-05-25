import type React from "react"
import { Box, Breadcrumb } from "@chakra-ui/react"
import { Link as RouterLink, useLocation } from "react-router-dom"

export interface BreadcrumbItem {
    label: React.ReactNode
    href?: string
    isCurrentPage?: boolean
}

interface BreadcrumbNavigationProps
    extends Omit<React.ComponentProps<typeof Breadcrumb.Root>, "children"> {
    items?: BreadcrumbItem[]
    homeLabel?: React.ReactNode
    showHome?: boolean
    separator?: React.ReactNode
    currentPageLabel?: React.ReactNode
    labelFormatter?: (segment: string) => React.ReactNode
}

const formatSegment = (segment: string) =>
    decodeURIComponent(segment)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())

const buildItemsFromPathname = (
    pathname: string,
    homeLabel: React.ReactNode,
    showHome: boolean,
    currentPageLabel?: React.ReactNode,
    labelFormatter: (segment: string) => React.ReactNode = formatSegment,
) => {
    const segments = pathname.split("/").filter(Boolean)
    const generatedItems: BreadcrumbItem[] = showHome
        ? [{ label: homeLabel, href: "/" }]
        : []

    segments.forEach((segment, index) => {
        const isCurrentPage = index === segments.length - 1
        const item: BreadcrumbItem = {
            label: isCurrentPage && currentPageLabel ? currentPageLabel : labelFormatter(segment),
            isCurrentPage,
        }

        if (!isCurrentPage) {
            item.href = `/${segments.slice(0, index + 1).join("/")}`
        }

        generatedItems.push(item)
    })

    if (segments.length === 0 && generatedItems[0]) {
        generatedItems[0] = {
            label: generatedItems[0].label,
            isCurrentPage: true,
        }
    }

    return generatedItems
}

const BreadcrumbNavigation = ({
    items,
    homeLabel = "Home",
    showHome = true,
    separator = "/",
    currentPageLabel,
    labelFormatter,
    ...props
}: BreadcrumbNavigationProps) => {
    const location = useLocation()
    const breadcrumbItems =
        items?.length
            ? items
            : buildItemsFromPathname(
                location.pathname,
                homeLabel,
                showHome,
                currentPageLabel,
                labelFormatter,
            )

    if (breadcrumbItems.length === 0) return null

    return (
        <Box mb={4}>
            <Breadcrumb.Root
                aria-label="Breadcrumb"
                color="text.secondary"
                fontSize="sm"
                {...props}
            >
                <Breadcrumb.List
                    alignItems="center"
                    flexWrap="wrap"
                >
                    {breadcrumbItems.map((item, index) => {
                        const isLast = index === breadcrumbItems.length - 1
                        const isCurrentPage = item.isCurrentPage ?? isLast
                        const key = `${String(item.label)}-${item.href ?? index}`

                        return (
                            <Breadcrumb.Item key={key}>
                                {item.href && !isCurrentPage ? (
                                    <Breadcrumb.Link
                                        asChild
                                        color="text.secondary"
                                        fontWeight="medium"
                                        lineHeight="1.2"
                                        transition="color 0.2s ease"
                                        _hover={{
                                            color: "accent.600",
                                            textDecoration: "none",
                                        }}
                                        _focusVisible={{
                                            borderRadius: "sm",
                                            boxShadow: "0 0 0 3px var(--chakra-colors-accent-100)",
                                            outline: "none",
                                        }}
                                    >
                                        <RouterLink to={item.href}>{item.label}</RouterLink>
                                    </Breadcrumb.Link>
                                ) : (
                                    <Breadcrumb.CurrentLink
                                        color="text.primary"
                                        fontWeight="semibold"
                                        lineHeight="1.2"
                                    >
                                        {item.label}
                                    </Breadcrumb.CurrentLink>
                                )}

                                {!isLast && (
                                    <Breadcrumb.Separator
                                        color="neutral.400"
                                        lineHeight="1"
                                        mx={2}
                                    >
                                        {separator}
                                    </Breadcrumb.Separator>
                                )}
                            </Breadcrumb.Item>
                        )
                    })}
                </Breadcrumb.List>
            </Breadcrumb.Root>
            {/* divider here */}
            <Box borderBottom="1px solid" borderColor="neutral.200" mt={4} mb={6} />
        </Box>
    )
}

export default BreadcrumbNavigation
