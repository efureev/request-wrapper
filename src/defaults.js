const defaultConfig = {
  baseURL: '/',
  timeout: 10000,
  enabledCORS: false,
  headers: {},
  onThrowErrorFn: null, // (error, instance) => { return Promise.reject(error) },
  afterInitFn: null, //(instance) => {},
  responseWrap: {
    dataKey: 'data',
    statusKey: 'status',
    fn: null, //(instance) => {},
  },

}

export default defaultConfig
