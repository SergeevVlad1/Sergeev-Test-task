import { useQuery } from "@tanstack/react-query"
import { useGetLabels } from "../../api/services/labels.service"
import styles from './labels.module.scss'
import { CreateLabelForm } from "../../components/create-label-form/create-label-form.component"
import { LabelList } from "../../components/label-list/label-list.component"


export const Labels = () => {
    const { data: labels, error, isLoading } = useQuery({
        queryFn: useGetLabels,
        queryKey: ['labels'],
    })

    if (error) {
        throw new Error(`${error}`)
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className={styles['users_wrapper']}>
            <CreateLabelForm />

            <div className={styles['user_wrapper']}>
                <LabelList labels={labels} task={{ id: '', title: '', task_labels: [] }} />
            </div>
        </div>
    )
}