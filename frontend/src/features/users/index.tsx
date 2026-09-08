import { Box } from "@chakra-ui/react"
import UsersList from "@/features/users/components/UsersList"
import Tabs from "@/shared/components/molecules/tabs"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { FaUsers } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import CreateUserPage from "./components/createUserPage";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/shared/i18n/useI18n";

const UsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [listVersion, setListVersion] = useState(0)
    const { t } = useI18n()
    const activeTab = searchParams.get("tab") === "create" ? "create" : "all"
    const breadcrumbItems =
        activeTab === "create"
            ? [
                { label: t("dashboard"), href: "/" },
                { label: t("users"), href: "/users" },
                { label: t("users.add"), isCurrentPage: true },
            ]
            : [
                { label: t("dashboard"), href: "/" },
                { label: t("users"), isCurrentPage: true },
            ]

    const showUsersList = () => {
        setSearchParams({})
    }

    const options = [
        {
            icon: <FaUsers />,
            label: t("users.list"),
            value: "all",
            content: <UsersList key={listVersion} />
        },
        {
            icon: <IoMdPersonAdd />,
            label: t("users.add"),
            value: "create",
            content: (
                <CreateUserPage
                    showHeader={false}
                    onCancel={showUsersList}
                    onSuccess={() => {
                        setListVersion((version) => version + 1)
                        showUsersList()
                    }}
                />
            )
        }
    ]

    return (
        <Box p={4}>
            <BreadcrumbNavigation
                mb={4}
                items={breadcrumbItems}
            />

            <Tabs
                options={options}
                value={activeTab}
                variant="underline"
                onValueChange={(details) => {
                    if (details.value === "create") {
                        setSearchParams({ tab: "create" })
                        return
                    }

                    showUsersList()
                }}
            />
        </Box>
    )
}

export default UsersPage
