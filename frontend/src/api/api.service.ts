import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IRequestOptions } from '../util-functions/util-functions.types';

export const createRequest = async <RequestData>(
  options: IRequestOptions<RequestData>
): Promise<AxiosResponse> => {
  const { url, method, data, headers, params } = options;

  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    url,
    method,
    data,
    params,
    headers: {
      ...headers,
    },
  };

  const response = await axios(config);

  return response;
};
