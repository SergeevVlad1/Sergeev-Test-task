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
    await createRequest({
        url: `/api/rest/task_labels`,
        method: HttpMethodEnum.POST,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ 
            task_id: Number(task.id), 
            label_id: Number(labelId) 
        })
    });
};

export const removeTaskLabel = async (task: ITask, labelId: string) => {
    await createRequest({
        url: `/api/rest/task_labels/${task.id}/${labelId}`,
        method: HttpMethodEnum.DELETE,
    });
}; 
