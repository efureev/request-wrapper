import isFunction from '@feugene/mu/src/is/isFunction'

const defaultConfig = {
  baseURL: '/',
  timeout: 10000,
  enabledCORS: false,
  headers: {},
  onThrowErrorFn: null, // (error, instance) => { return Promise.reject(error) },
  // afterInitFn: null, //(instance) => {},
  /*addAfterInitFn: (fn) => {
    if (isFunction(fn)) {
      this.afterInitFns.push(fn)
    }
  },
  afterInitFns: [],*/
  isResponseWrap: true,
  responseWrapper: null /* {
   dataKey: 'data',
   statusKey: 'status',
   fn: null, //(instance) => {},
   }*/,
}

export default defaultConfig
