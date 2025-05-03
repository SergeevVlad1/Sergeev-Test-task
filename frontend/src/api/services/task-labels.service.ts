import { createRequest } from "../api.service";
import { API_URLS } from "../api.costant";
import { HttpMethodEnum } from "../../util-functions/util-functions.types";

export interface ITaskLabel {
    label_id: string;
}

export interface ITask {
    id: string;
    title: string;
    description?: string;
    task_labels: ITaskLabel[];
}

export const addTaskLabel = async (task: ITask, labelId: string) => {
    const taskLabels = Array.isArray(task.task_labels) ? task.task_labels : [];
    const exists = taskLabels.some((l: ITaskLabel) => l.label_id === labelId);
    if (!exists) {
        const updated: ITask = {
            ...task,
            task_labels: [...taskLabels, { label_id: labelId }]
        };
        await createRequest({
            url: `${API_URLS.TASKS}/${task.id}`,
            method: HttpMethodEnum.PUT,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(updated)
        });
    }
};

export const removeTaskLabel = async (task: ITask, labelId: string) => {
    const taskLabels = Array.isArray(task.task_labels) ? task.task_labels : [];
    const updated: ITask = {
        ...task,
        task_labels: taskLabels.filter((l: ITaskLabel) => l.label_id !== labelId)
    };
    await createRequest({
        url: `${API_URLS.TASKS}/${task.id}`,
        method: HttpMethodEnum.PUT,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(updated)
    });
}; 
