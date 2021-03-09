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
      if (!instance.fillWrapperer) {
        config.responseWrapper.fn(instance)
        instance.fillWrapperer = true
      }
    }
  } else {
    config.responseWrapper = null
    instance.fillWrapperer = false
  }
}

/**
 * @param {Request} instance
 * @return {AxiosInstance}
 */
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
    this.interceptors = {
      request: [],
      response: [],
    }

    this.builder = defaultBuilder
    this.config = { ...defaults, ...config }

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

        instance.applyInterceptors()
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

  applyInterceptors() {
    this.registerInterceptors(this.axios.interceptors.request, ...this.interceptors.request)
    this.registerInterceptors(this.axios.interceptors.response, ...this.interceptors.response)
  }

  addInterceptors(selfTarget, ...source) {
    source.forEach((callback) => {
      selfTarget.push(callback)
    })
  }

  registerRequestInterceptors(...source) {
    this.addInterceptors(this.interceptors.request, ...source)
    // this.registerInterceptors(this.axios.interceptors.request, ...source)
  }

  registerResponseInterceptors(...source) {
    this.addInterceptors(this.interceptors.response, ...source)
    // this.registerInterceptors(this.axios.interceptors.response, ...source)
  }
}
