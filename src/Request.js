import axios from 'axios'
import defaults from './defaults'
import { isArray, isFunction } from '@feugene/mu/src/is'
import defaultResponseWrapper from './interceptors/response/WrapperInterceptor'

const buildResponseWrapper = (config) => {
  return isFunction(config.responseWrapper)
    ? (config.responseWrapper)(config)
    : defaultResponseWrapper(config.responseWrapper || {})

}

export default class Request {
  constructor(config = {}) {
    this.config = { ...defaults, ...config }

    this.axios = axios.create(this.config)
    this.axios.wrapper = this

    if (this.config.enabledCORS) {
      this.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    }

    return this.init()
  }

  init() {
    if (this.config.isResponseWrap) {
      this.config.responseWrapper = buildResponseWrapper(this.config)

      if (isFunction(this.config.responseWrapper?.fn)) {
        (this.config.responseWrapper.fn)(this)
      }
    }

    if (isFunction(this.config.afterInitFn)) {
      (this.config.afterInitFn)(this)
    }

    return this.axios
  }

  normalizeInterceptors(callback) {
    const cb = callback(this.config)
    let successCb
    let errorCb

    if (isArray(cb) && cb.length > 1) {
      successCb = cb[0]
      errorCb = isFunction(cb[1]) ? cb[1] : error => Promise.reject(error)
    } else {
      successCb = cb
      errorCb = error => Promise.reject(error)
    }

    return [successCb, errorCb]
  }

  /**
   * @param target
   * @param source
   */
  registerInterceptors(target, ...source) {
    source.forEach(callback => {
      target.use(...this.normalizeInterceptors(callback))
    })
  }

  registerRequestInterceptors(...source) {
    this.registerInterceptors(this.axios.interceptors.request, ...source)
  }

  registerResponseInterceptors(...source) {
    this.registerInterceptors(this.axios.interceptors.response, ...source)
  }
}
