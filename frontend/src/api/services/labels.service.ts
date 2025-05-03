import { ICreateLabelForm } from "../../components/create-label-form/create-label-form.component"
import { HttpMethodEnum } from "../../util-functions/util-functions.types"
import { API_URLS } from "../api.costant"
import { createRequest } from "../api.service"

export const useGetLabels = async () => {
    const response = await createRequest({
        url: `${API_URLS.LABELS}`,
        method: HttpMethodEnum.GET
    });
    return response.data;
}

export const useCreateLabel = async (data: ICreateLabelForm): Promise<ICreateLabelForm | null> => {
    const response = await createRequest({
        url: `${API_URLS.LABELS}`,
        method: HttpMethodEnum.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data)
    })
    return response.data
}