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
  responseWrapper: null,
  /*
   responseWrapper:{
   dataKey: 'data',
   statusKey: 'status',
   fn: null, //(instance) => {},
   },*/
  afterBuilding: null,
  /*afterBuilding: function(instance) {
   instance.registerResponseInterceptors(ActionInterceptor)
   },*/
}

export default defaultConfig
