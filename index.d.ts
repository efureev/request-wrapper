import {AxiosInterceptorManager, AxiosRequestConfig} from "axios";

export interface RequestConfig {
    baseURL?: string;
    timeout?: number;
    headers?: object;
    enabledCORS?: boolean;
    onThrowErrorFn?: () => object;
    responseWrap?: {
        dataKey?: string,
        statusKey?: string,
        fn: ((instance) => object) | null,
    },
    afterInitFn?: () => object;
}


export interface Request {
    config: RequestConfig;

    registerRequestInterceptors(source: [])

    registerResponseInterceptors(source: [])

    registerInterceptors(source: [], target: AxiosInterceptorManager<AxiosRequestConfig>)
}
