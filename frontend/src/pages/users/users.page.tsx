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

    if (error) {
        throw new Error(`${error}`)
    }

    const getInitials = (first = '', last = '') => {
        const f = first ? first.trim().charAt(0).toUpperCase() : '';
        const l = last ? last.trim().charAt(0).toUpperCase() : '';
        return `${f}${l}` || '👤';
    }

    return (
        <div className="container-premium">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="page-title">Team Members</h1>
                <p className="page-subtitle">Manage system users, view their profiles, and assign them to tasks.</p>
            </header>

            <div className="layout-split">
                <div className="card-premium" style={{ height: 'fit-content' }}>
                    <h2 className={styles['form_title']}>Add Team Member</h2>
                    <p className={styles['form_desc']}>Fill in details to onboard a new collaborator.</p>
                    <CreateUserForm />
                </div>

                <div className={styles['users_grid']}>
                    {isLoading ? (
                        <div className={styles['loading_state']}>Loading teammates...</div>
                    ) : users?.users?.length === 0 ? (
                        <div className={styles['empty_state']}>No team members onboarded yet.</div>
                    ) : (
                        users?.users?.map((user: any) => {
                            const first = user.first_name || user.firstName || '';
                            const last = user.last_name || user.lastName || '';
                            const initials = getInitials(first, last);
                            
                            return (
                                <div key={user.id} className="card-premium">
                                    <div className={styles['user_header']}>
                                        <div className={styles['avatar_circle']}>
                                            {initials}
                                        </div>
                                        <div className={styles['user_meta']}>
                                            <h3 className={styles['user_name']}>
                                                {first} {last}
                                            </h3>
                                            <span className={styles['user_badge']}>ID: #{user.id}</span>
                                        </div>
                                    </div>
                                    <div className={styles['user_bio']}>
                                        {user.bio || 'No biography details provided.'}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}