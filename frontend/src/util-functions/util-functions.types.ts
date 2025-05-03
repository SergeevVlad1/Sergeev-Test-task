export enum HttpMethodEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export interface IRequestOptions<RequestData = unknown> {
    url: string;
    method: HttpMethodEnum;
    data?: RequestData;
    params?: object;
    headers?: Record<string, string>;
  }