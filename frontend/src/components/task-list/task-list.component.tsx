import React, { useState } from "react";
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

    const { data: labels, isLoading: areLabelsLoading } = useQuery<any>({
        queryKey: ['labels'],
        queryFn: useGetLabels,
        staleTime: 1000 * 60 * 5,
    });

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
        <div className="layout-split">
            {/* Left Column: Create Task Form Sidebar */}
            <div className="card-premium" style={{ height: 'fit-content' }}>
                <h2 className={styles['form_title']}>New Workspace Task</h2>
                <p className={styles['form_desc']}>Onboard a task and tag category labels.</p>
                <TaskForm 
                    useMethod={HttpMethodEnum.POST} 
                    onTaskCreated={handleTaskCreated} 
                />
            </div>

            {/* Right Column: Tasks List */}
            <div className={styles['tasks_list_wrapper']}>
                {tasks.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>📋</span>
                        <h3>No active tasks in scope</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                            Get started by creating a new task from the sidebar.
                        </p>
                    </div>
                ) : (
                    <ul className={styles.tasksList}>
                        {tasks.map((task) => (
                            <li key={task.id} className={`${styles.taskItem} card-premium`}>
                                <div className={styles.taskContent}>
                                    <div className={styles.taskHeader}>
                                        <h3 className={styles.taskTitle}>{task.title}</h3>
                                        <span className={styles.taskId}>#{task.id}</span>
                                    </div>
                                    <p className={styles.taskDescription}>{task.description}</p>
                                    
                                    {!areLabelsLoading && labels && (
                                        <div className={styles.taskLabelsSection}>
                                            <span className={styles.labelsLabel}>Category Tags</span>
                                            <LabelList
                                                labels={labels?.labels}
                                                task={task}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.taskActions}>
                                    <button
                                        onClick={() => handleEditClick(task.id)}
                                        disabled={isDeleting}
                                        className={styles.editButton}
                                    >
                                        {editingTaskId === task.id ? 'Close Editor' : '✏️ Edit Details'}
                                    </button>
                                    
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        disabled={isDeleting}
                                        className={styles.deleteButton}
                                    >
                                        {isDeleting && task.id === editingTaskId ? 'Deleting...' : '🗑️ Delete'}
                                    </button>
                                </div>

                                {editingTaskId === task.id && (
                                    <div className={styles.editForm}>
                                        <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                            Edit Task Parameters
                                        </h4>
                                        <TaskForm
                                            useMethod={HttpMethodEnum.PUT}
                                            taskId={task.id}
                                            initialTitle={task.title}
                                            initialDescription={task.description}
                                            onTaskCreated={handleTaskCreated}
                                        />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};