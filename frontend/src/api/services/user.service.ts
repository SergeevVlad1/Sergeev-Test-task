import { ICreateUserForm } from "../../components/create-user-form/create-user-form.component"
import { HttpMethodEnum } from "../../util-functions/util-functions.types"
import { API_URLS } from "../api.costant"
import { createRequest } from "../api.service"

export const useGetUser = () => {
    return createRequest({
        url: `${API_URLS.USERS}`,
        method: HttpMethodEnum.GET
    })
}

export const useCreateUser = async (data: ICreateUserForm): Promise<ICreateUserForm | null> => {
    const response = await createRequest({
        url: `${API_URLS.USERS}`,
        method: HttpMethodEnum.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data)
    })
    return response.data
}