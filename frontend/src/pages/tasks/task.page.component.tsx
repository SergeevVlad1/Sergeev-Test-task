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

    const { data: tasks, error, isLoading, refetch } = useQuery<any>({
        queryFn: useGetTask,
        queryKey: ['tasks'],
    })

    const { data: labels, refetch: refetchLabels } = useQuery<any>({
        queryFn: useGetLabels,
        queryKey: ['labels'],
    })

    const filteredTasks = tasks?.tasks?.filter((task: ITask) => {
        const matchesTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLabel = selectedLabel
            ? task.task_labels?.some((label: ITaskLabel) => String(label.label_id) === String(selectedLabel))
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

    return (
        <div className="container-premium">
            <header className={styles['board_header']}>
                <div>
                    <h1 className="page-title">Workspace Tasks</h1>
                    <p className="page-subtitle">Track, delegate, and manage sprints in real time.</p>
                </div>
                <div className={styles['board_stats']}>
                    <div className={styles['stat_card']}>
                        <span className={styles['stat_num']}>{tasks?.tasks?.length || 0}</span>
                        <span className={styles['stat_label']}>Total Tasks</span>
                    </div>
                    <div className={styles['stat_card']}>
                        <span className={styles['stat_num']} style={{ color: 'var(--accent-primary)' }}>
                            {filteredTasks.length}
                        </span>
                        <span className={styles['stat_label']}>Filtered</span>
                    </div>
                </div>
            </header>

            {/* Dashboard Control Bar */}
            <div className={`card-premium ${styles['controls_bar']}`}>
                <div className={styles['search_input_wrapper']}>
                    <span className={styles['input_icon']}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles['search_input']}
                    />
                </div>
                <div className={styles['filter_select_wrapper']}>
                    <span className={styles['input_icon']}>🏷️</span>
                    <select
                        value={selectedLabel || ''}
                        onChange={(e) => setSelectedLabel(e.target.value || null)}
                        className={styles['filter_select']}
                    >
                        <option value="">All Category Labels</option>
                        {labels?.labels?.map((label: ILabel) => (
                            <option key={label.id} value={label.id}>
                                {label.caption}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className={styles['loading_state']}>Loading workspace task boards...</div>
            ) : (
                <TasksList tasks={filteredTasks} />
            )}
        </div>
    )
}
