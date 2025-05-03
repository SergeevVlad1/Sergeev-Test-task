import { ICreateTaskForm } from "../../components/create-task-form/create-task-form.types"
import { HttpMethodEnum } from "../../util-functions/util-functions.types"
import { API_URLS } from "../api.costant"
import { createRequest } from "../api.service"

export const useGetTask = async () => {
    const response = await createRequest({
        url: `${API_URLS.TASKS}`,
        method: HttpMethodEnum.GET,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useCreateTask = async (data: ICreateTaskForm, method: HttpMethodEnum): Promise<ICreateTaskForm | null> => {
    const response = await createRequest({
        url: `${API_URLS.TASKS}`,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data)
    })
    return response.data
}

export const useUpdateTask = async (data: Partial<ICreateTaskForm>, id: string): Promise<ICreateTaskForm | null> => {
    const response = await createRequest({
        url: `${API_URLS.TASKS}/${id}`,
        method: HttpMethodEnum.PUT,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data)
    })
    return response.data
}

export const useDeleteTask = async (id: string): Promise<ICreateTaskForm | null> => {
    const response = await createRequest({
        url: `${API_URLS.TASKS}/${id}`,
        method: HttpMethodEnum.DELETE,
        headers: {
            'Content-Type': 'application/json',
        },
    })
    
    return response.data
}
