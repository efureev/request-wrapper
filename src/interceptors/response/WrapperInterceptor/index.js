import WrapperInterceptor from './WrapperInterceptor'

const wrapper = (config = {}) => ({
  dataKey: 'dataKey' in config ? config.dataKey : 'data',
  statusKey: config.statusKey ? config.statusKey : 'status',
  fn: config.fn ?? ((instance) => {
    instance.registerResponseInterceptors(WrapperInterceptor)
  }),
})

export default wrapper
