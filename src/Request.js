import axios from 'axios'
import defaults from './defaults'
import { isArray, isFunction } from '@feugene/mu/src/is'
import defaultResponseWrapper from './interceptors/response/WrapperInterceptor'

const buildResponseWrapper = (config) => {
  return isFunction(config.responseWrapper)
    ? config.responseWrapper(config)
    : defaultResponseWrapper(config.responseWrapper || {})
}

function buildAxios(instance) {
  instance.axios = axios.create(instance.config)
  instance.axios.wrapper = instance
  instance.axios.reconfigure = instance.buildReconfigureFn(instance)
}

function buildConfig(config, instance) {
  if (config.isResponseWrap) {
    config.responseWrapper = buildResponseWrapper(config)

    if (isFunction(config.responseWrapper.fn)) {
      config.responseWrapper.fn(instance)
    }
  } else {
    config.responseWrapper = null
  }
}

const defaultBuilder = (instance) => {
  buildAxios(instance)
  buildConfig(instance.config, instance)

  if (instance.config.enabledCORS) {
    instance.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
  }

  return instance.axios
}

export default class Request {
  constructor(config = {}) {
    this.builder = defaultBuilder
    this.config = { ...defaults, ...config }
    this.afterInitFns = []

    return this.build(this)
  }

  build() {
    if (isFunction(this.config.builder)) {
      this.builder = this.config.builder
      delete this.config.builder
    }

    return this.builder(this)
  }

  buildReconfigureFn(instance) {
    return function reconfigure(fn) {
      if (isFunction(fn)) {
        fn(instance)
        instance.build()
      }
      return instance.axios
    }
  }

  normalizeInterceptors(callback) {
    const cb = callback(this.config)
    let successCb
    let errorCb

    if (isArray(cb) && cb.length > 1) {
      successCb = cb[0]
      errorCb = isFunction(cb[1]) ? cb[1] : (error) => Promise.reject(error)
    } else {
      successCb = cb
      errorCb = (error) => Promise.reject(error)
    }

    return [successCb, errorCb]
  }

  /**
   * @param target
   * @param source
   */
  registerInterceptors(target, ...source) {
    source.forEach((callback) => {
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
