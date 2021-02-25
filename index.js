import Request from './src/Request'
import WrapperInterceptor from './src/interceptors/response/WrapperInterceptor'

const request = (config = {}) => {
  config.responseWrap = {
    dataKey: 'data',
    statusKey: 'status',
    fn: (instance) => {
      instance.registerResponseInterceptors(WrapperInterceptor)
    },
  }

  return new Request(config)
}

export default request
export { Request }
