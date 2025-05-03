import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import styles from './task.page.component.module.scss'
import { useGetTask } from "../../api/services/tasks.service"
import { useGetLabels } from "../../api/services/labels.service"
import { TasksList } from "../../components/task-list/task-list.component"

interface ILabel {
    id: string;
    caption: string;
}

interface ITaskLabel {
    label_id: string;
}

interface ITask {
    id: string;
    title: string;
    description?: string;
    task_labels: ITaskLabel[];
} 

export const Tasks = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

    const { data: tasks, error, isLoading, refetch } = useQuery<ITask[]>({
        queryFn: useGetTask,
        queryKey: ['tasks'],
    })

    const { data: labels, refetch: refetchLabels } = useQuery({
        queryFn: useGetLabels,
        queryKey: ['labels'],
    })

    const filteredTasks = tasks?.filter((task: ITask) => {
        const matchesTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLabel = selectedLabel
            ? task.task_labels?.some((label: ITaskLabel) => label.label_id === selectedLabel)
            : true
        return matchesTitle && matchesLabel
    }) || []

    useEffect(() => {
        refetch()
        refetchLabels()
    }, [])

    if (error) {
        throw new Error(`${error}`)
    }

    console.log(labels?.map((label: ILabel) => (
        label.caption
    )))

    if (isLoading) return <div>Loading...</div>

    return (
        <div className={styles['users_wrapper']}>
            <div className={styles['user_wrapper']}>
                <input
                    type="text"
                    placeholder="Search tasks by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
                />
                <select
                    value={selectedLabel || ''}
                    onChange={(e) => setSelectedLabel(e.target.value || null)}
                    style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
                >
                    <option value="">All Labels</option>
                    {labels?.map((label: ILabel) => (
                        <option key={label.id} value={label.id}>
                            {label.caption}
                        </option>
                    ))}
                    
                </select>
                
                <TasksList tasks={filteredTasks} />
            </div>
        </div>
    )
}
