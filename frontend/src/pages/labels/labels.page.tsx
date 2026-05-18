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

    return (
        <div className="container-premium">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="page-title">Task Labels</h1>
                <p className="page-subtitle">Create and configure taxonomy tags to categorize tasks and highlight workflows.</p>
            </header>

            <div className="layout-split">
                {/* Left Side: Create Label Form Card */}
                <div className="card-premium" style={{ height: 'fit-content' }}>
                    <h2 className={styles['form_title']}>Create Label</h2>
                    <p className={styles['form_desc']}>Add a color-coded tag to categorize your tasks.</p>
                    <CreateLabelForm />
                </div>

                {/* Right Side: Labels List */}
                <div className="card-premium">
                    <h2 className={styles['form_title']} style={{ marginBottom: '1.5rem' }}>All Taxonomy Tags</h2>
                    {isLoading ? (
                        <div className={styles['loading_state']}>Loading labels...</div>
                    ) : labels?.labels?.length === 0 ? (
                        <div className={styles['empty_state']}>No labels created yet.</div>
                    ) : (
                        <LabelList labels={labels?.labels} task={{ id: '', title: '', task_labels: [] }} />
                    )}
                </div>
            </div>
        </div>
    )
}