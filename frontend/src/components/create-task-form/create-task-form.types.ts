import { HttpMethodEnum } from "../../util-functions/util-functions.types";

export interface ITaskLabel {
    label_id: number;
}

export interface ICreateTaskForm {
    id?: number;
    title: string;
    description: string;
    task_labels: ITaskLabel[];
}

export interface ICreateTaskProps {
    useMethod: HttpMethodEnum;
    taskId?: string;
    onTaskCreated?: () => void;
    initialTitle?: string;
    initialDescription?: string;
    initialTaskLabels?: ITaskLabel[];
}