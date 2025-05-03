import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDeleteTask as deleteTaskFn } from "../../api/services/tasks.service";
import { TaskForm } from "../create-task-form/create-task-form.component";
import { HttpMethodEnum } from "../../util-functions/util-functions.types";
import { useGetLabels } from "../../api/services/labels.service";
import { LabelList } from "../label-list/label-list.component";
import { ITask } from "../../api/services/task-labels.service";
import styles from './task-list.module.scss';

interface TasksListProps {
    tasks: ITask[];
}

export const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Fetch labels with proper typing
    const { data: labels, isLoading: areLabelsLoading } = useQuery({
        queryKey: ['labels'],
        queryFn: useGetLabels,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Delete mutation with modern syntax
    const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
        mutationFn: (taskId: string) => deleteTaskFn(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: ['tasks'],
                exact: true
            });
        },
        onError: (error: Error) => {
            console.error('Error deleting task:', error.message);
        }
    });

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                console.error('Failed to delete task:', error instanceof Error ? error.message : 'Unknown error');
            }
        }
    };

    const handleEditClick = (taskId: string) => {
        setEditingTaskId(prev => prev === taskId ? null : taskId);
    };

    const handleTaskCreated = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        setEditingTaskId(null);
    };

    if (!Array.isArray(tasks)) {
        return <div className={styles.error}>Error: Tasks data is not in expected format</div>;
    }

    return (
        <div className={styles.tasksContainer}>
            <div className={styles.taskFormWrapper}>
                <TaskForm 
                    useMethod={HttpMethodEnum.POST} 
                    onTaskCreated={handleTaskCreated} 
                />
            </div>

            {tasks.length === 0 ? (
                <div className={styles.emptyState}>No tasks found</div>
            ) : (
                <ul className={styles.tasksList}>
                    {tasks.map((task) => (
                        <li key={task.id} className={styles.taskItem}>
                            <div className={styles.taskContent}>
                                <h3 className={styles.taskTitle}>{task.title}</h3>
                                <p className={styles.taskDescription}>{task.description}</p>
                                
                                {!areLabelsLoading && labels && (
                                    <LabelList
                                        labels={labels}
                                        task={task}
                                        // onLabelUpdate={() => queryClient.invalidateQueries(['labels'])}
                                    />
                                )}
                            </div>

                            <div className={styles.taskActions}>
                                <button
                                    onClick={() => handleEditClick(task.id)}
                                    disabled={isDeleting}
                                    className={styles.editButton}
                                >
                                    {editingTaskId === task.id ? 'Cancel' : 'Edit'}
                                </button>
                                
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    disabled={isDeleting}
                                    className={styles.deleteButton}
                                >
                                    {isDeleting && task.id === editingTaskId ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>

                            {editingTaskId === task.id && (
                                <div className={styles.editForm}>
                                    <TaskForm
                                        useMethod={HttpMethodEnum.PUT}
                                        taskId={task.id}
                                        initialTitle={task.title}
                                        initialDescription={task.description}
                                        // initialTaskLabels={task.task_labels || []}
                                        onTaskCreated={handleTaskCreated}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};