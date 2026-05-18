import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EInputTypes, Input } from "../input/input.component";
import styles from '../default-form/default-form.component.module.scss';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateTask as createTaskFn, useUpdateTask as updateTaskFn } from "../../api/services/tasks.service";
import { HttpMethodEnum } from "../../util-functions/util-functions.types";
import { ICreateTaskForm, ICreateTaskProps } from "./create-task-form.types";

export const TaskForm = ({ 
    useMethod, 
    taskId, 
    onTaskCreated, 
    initialTitle = '', 
    initialDescription = '', 
    initialTaskLabels = [] 
}: ICreateTaskProps) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset 
    } = useForm<ICreateTaskForm>({
        mode: 'onChange',
        defaultValues: {
            title: initialTitle,
            description: initialDescription,
            task_labels: initialTaskLabels,
        }
    });

    const queryClient = useQueryClient();

    const { mutateAsync: createTask, isPending: isCreating } = useMutation({
        mutationFn: (data: ICreateTaskForm) => createTaskFn(data, HttpMethodEnum.POST),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onTaskCreated?.();
            reset();
        },
        onError: (error) => {
            console.error('Error creating task:', error);
        }
    });

    const { mutateAsync: updateTask, isPending: isUpdating } = useMutation({
        mutationFn: ({ data, id }: { data: Partial<ICreateTaskForm>, id: string }) => 
            updateTaskFn(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onTaskCreated?.();
        },
        onError: (error) => {
            console.error('Error updating task:', error);
        }
    });

    useEffect(() => {
        reset({
            title: initialTitle,
            description: initialDescription,
            task_labels: initialTaskLabels,
        });
    }, [initialTitle, initialDescription, reset]);

    const onSubmit: SubmitHandler<ICreateTaskForm> = async (data, event) => {
        event?.preventDefault();

        try {
            if (useMethod === HttpMethodEnum.POST) {
                await createTask(data);
            } else if (useMethod === HttpMethodEnum.PUT && taskId) {
                await updateTask({ data, id: taskId });
            }
        } catch (error) {
            console.error('Error creating/updating task:', error);
        }
    };

    const isMutationPending = isCreating || isUpdating;

    return (
        <form className={styles['create_wrapper_form']} onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles['create_ul_form']}>
                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Task Title</label>
                    <Input
                        className={styles['create_input_form']}
                        {...register('title', {
                            required: 'Title is required',
                            minLength: {
                                value: 3,
                                message: 'Title must be at least 3 characters'
                            }
                        })}
                        type={EInputTypes.TEXT}
                        placeholder="e.g. Implement Oauth Authentication"
                        onDisabled={isMutationPending || isSubmitting}
                    />
                    {errors.title && <p className={styles['input_error']}>{errors.title.message}</p>}
                </li>
                
                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Task Description</label>
                    <Input
                        className={styles['create_input_form']}
                        {...register('description', {
                            required: 'Description is required',
                            minLength: {
                                value: 10,
                                message: 'Description must be at least 10 characters'
                            }
                        })}
                        type={EInputTypes.TEXT}
                        placeholder="Provide details and expectations for the team..."
                        onDisabled={isMutationPending || isSubmitting}
                    />
                    {errors.description && <p className={styles['input_error']}>{errors.description.message}</p>}
                </li>

                <button 
                    type="submit" 
                    disabled={isMutationPending || isSubmitting}
                >
                    {isMutationPending ? 'Processing...' : 
                     useMethod === HttpMethodEnum.POST ? '➕ Create Task' : '💾 Update Task'}
                </button>
            </ul>
        </form>
    );
};