import { Request } from '../index'

import assert from 'assert'
import { isArray, isEmpty, isFunction, isObject } from '@feugene/mu/src/is'
import { customRequest as customRequestBuilder } from './custom-config'
import AuthInterceptor from '../src/interceptors/request/AuthInterceptor'
import ConsoleInterceptor from './utils/ConsoleInterceptor'
import ConsoleInterceptor2 from './utils/ConsoleInterceptor2'
import ConsoleResponseInterceptor from './utils/ConsoleResponseInterceptor'

/**
 *
 * @param {Axios} axiosInstance
 * @return {Axios}
 */
const customRequest = (axiosInstance) => {
  return axiosInstance.reconfigure(
    /**
     * @param {Request} instance
     */
    (instance) => {
      instance.registerRequestInterceptors(AuthInterceptor, ConsoleInterceptor, ConsoleInterceptor2)
    },
  )
}

const customRequest2 = (axiosInstance) => {
  return axiosInstance.reconfigure(
    /**
     * @param {Request} instance
     */
    (instance) => {
      instance.registerResponseInterceptors(ConsoleResponseInterceptor)
    },
  )
}

describe('create request with custom config and wrapper', () => {
  it('same instance', () => {
    const baseRequest = customRequestBuilder()
    assert.strictEqual(true, baseRequest.wrapper instanceof Request)
    assert.strictEqual(true, isObject(baseRequest.wrapper.config))

    assert.strictEqual(true, isObject(baseRequest.wrapper.interceptors))
    assert.strictEqual(true, isArray(baseRequest.wrapper.interceptors.request))
    assert.strictEqual(true, isArray(baseRequest.wrapper.interceptors.response))
    assert.strictEqual(true, baseRequest.wrapper.interceptors.request.length === 0)
    assert.strictEqual(true, baseRequest.wrapper.interceptors.response.length === 1)

  })

  describe('wrap Request', () => {
    const baseRequest = customRequestBuilder()
    const request = customRequest2(customRequest(baseRequest))

    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))

      assert.strictEqual(true, isObject(request.wrapper.interceptors))
      assert.strictEqual(true, isArray(request.wrapper.interceptors.request))
      assert.strictEqual(true, isArray(request.wrapper.interceptors.response))
      assert.strictEqual(true, request.wrapper.interceptors.request.length === 3)
      assert.strictEqual(true, request.wrapper.interceptors.response.length === 2)
    })

    it('same config', () => {
      const config = { ...request.wrapper.config }
      assert.strictEqual('/api', config.baseURL)
      assert.strictEqual(10000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(2, Object.keys(config.headers).length)
      assert.strictEqual('test@example.com', config.headers['X-Debug-User'])
      assert.strictEqual(undefined, config.headers['X-Key'])
      assert.strictEqual(true, config.isResponseWrap)
      assert.strictEqual(true, isObject(config.responseWrapper))
    })
  })

  describe('checking Axios', () => {
    const baseRequest = customRequestBuilder()
    const request = customRequest2(customRequest(baseRequest))
    it('same instance', () => {
      assert.strictEqual(true, isFunction(request))
    })

    it('same config', () => {
      assert.strictEqual(false, isEmpty(request.interceptors.response.handlers))
      assert.strictEqual(false, isEmpty(request.interceptors.request.handlers))
    })
  })
})
