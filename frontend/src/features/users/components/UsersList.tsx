import { userApi } from "@/api/user.api"
import Typography from "@/shared/components/atoms/typography"
import Table from "@/shared/components/organisms/Table"
import { StatusBadge } from "@/shared/components/organisms/Table/StatusBadge"
import type { User } from "@/shared/types/user.type"
import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



const UsersList = () => {

    const [users, setUsers] = useState([])
    // const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status", render: (value: boolean) => <StatusBadge value={value} />},
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