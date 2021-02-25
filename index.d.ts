import { AxiosInterceptorManager, AxiosRequestConfig } from 'axios'

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

  registerRequestInterceptors(...source: [(config: RequestConfig) => object])

  registerResponseInterceptors(...source: [(config: RequestConfig) => object])

  registerInterceptors(target: AxiosInterceptorManager<AxiosRequestConfig>, ...source: [() => object])
}


declare const request: (RequestConfig) => Request

export default request
