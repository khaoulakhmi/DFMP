import { userApi } from "@/api/user.api"
import Typography from "@/shared/components/atoms/typography"
import Table from "@/shared/components/organisms/Table"
import { RoleBadge } from "@/shared/components/organisms/Table/RoleBadge"
import { StatusBadge } from "@/shared/components/organisms/Table/StatusBadge"
import type { User } from "@/shared/types/user.type"
import { Box, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



const UsersList = () => {

    const [users, setUsers] = useState([])
    // const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
     const columns = [
        {
            key:      "name",
            label:    "Name",
            sortable: true,
            render:   (value: unknown) => (
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        w="7" h="7"
                        borderRadius="full"
                        bg="primary.100"
                        color="primary.700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                        flexShrink={0}
                    >
                        {String(value).charAt(0).toUpperCase()}
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" color="neutral.900">
                        {String(value)}
                    </Text>
                </Box>
            )
        },
        {
            key:      "username",
            label:    "Username",
            sortable: true,
            render:   (value: unknown) => (
                <Text fontSize="sm" color="neutral.500">
                    @{String(value)}
                </Text>
            )
        },
        {
            key:      "phone",
            label:    "Phone Number",
            sortable: true,
        },
        {
            key:    "role",
            label:  "Role",
            render: (value: unknown) => (
                <RoleBadge value={String(value)} />   // 👈 role badge with icon
            )
        },
        {
            key:    "status",
            label:  "Status",
            render: (value: unknown) => (
                <StatusBadge value={value as boolean} /> // 👈 neutral badge with colored dot
            )
        },
    ]
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userApi.getAll()
                setUsers(data)
                console.log("Fetched users:", data)
            } catch (error) {
                console.error("Failed to fetch users:", error)
            }
        }
        fetchUsers()
    }, [])

    const handleEdit = (user: User) => {
        console.log("edit", user)
        navigate(`/users/${user.id}/edit`)
    }

    const handleDelete = (user: User) => {
        userApi.delete(user.id)
        console.log("delete", user)
    }
    return (
        <Box>
            {users.length > 0 ? 
            (
                <Box>
                    <Table
                        data={users}
                        columns={columns}
                        searchable
                        searchKeys={["name", "role", "username"]}
                        onEdit={handleEdit}
                        onDelete={handleDelete}

                    />
                </Box>
            ) : 
            (
                <Typography variant={"body"}>No users fetched yet.</Typography>
            )}
            
        </Box>
    )
}

export default UsersList