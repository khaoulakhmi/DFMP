import { Box } from "@chakra-ui/react"
import UsersList from "@/features/users/components/UsersList"
import Tabs from "@/shared/components/molecules/tabs"
import BreadcrumbNavigation from "@/shared/components/molecules/breadcrumbNavigation"
import { FaUsers } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import CreateUserPage from "./components/createUserPage";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";


const UsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [listVersion, setListVersion] = useState(0)
    const activeTab = searchParams.get("tab") === "create" ? "create" : "all"
    const breadcrumbItems =
        activeTab === "create"
            ? [
                { label: "Dashboard", href: "/" },
                { label: "Users", href: "/users" },
                { label: "Create User", isCurrentPage: true },
            ]
            : [
                { label: "Dashboard", href: "/" },
                { label: "Users", isCurrentPage: true },
            ]

    const showUsersList = () => {
        setSearchParams({})
    }

    const options = [
        {
            icon: <FaUsers />,
            label: "All Users",
            value: "all",
            content: <UsersList key={listVersion} />
        },
        {
            icon: <IoMdPersonAdd />,
            label: "Create New User",
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
