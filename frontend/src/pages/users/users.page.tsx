import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useGetUser } from "../../api/services/user.service"
import { CreateUserForm } from "../../components/create-user-form/create-user-form.component"
import styles from './users.module.scss'


export const Users = () => {
    const { data: users, error, isLoading } = useQuery({
        queryFn: useGetUser,
        queryKey: ['users'],
    })

    useEffect(() => {
        users
    }, [])

    if (error) {
        throw new Error(`${error}`)
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className={styles['users_wrapper']}>
            <CreateUserForm />

            <div className={styles['user_wrapper']}>
                {users?.data.map((user, index) => (
                    <div key={index} >
                        {user.firstName}
                    </div>
                ))}
            </div>
        </div>
    )
}