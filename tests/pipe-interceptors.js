import { Request } from '../index'

import assert from 'assert'
import { isArray, isEmpty, isFunction, isObject } from '@feugene/mu/src/is'
import { customRequest as customRequestBuilder } from './custom-config'
import AuthInterceptor from '../src/interceptors/request/AuthInterceptor'
import ConsoleInterceptor from './utils/ConsoleInterceptor'
import ConsoleResponseInterceptor from './utils/ConsoleResponseInterceptor'

const baseRequest = customRequestBuilder()

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
      instance.registerRequestInterceptors(AuthInterceptor, ConsoleInterceptor)
    }
  )
}

const customRequest2 = (axiosInstance) => {
  return axiosInstance.reconfigure(
    /**
     * @param {Request} instance
     */
    (instance) => {
      instance.registerResponseInterceptors(ConsoleResponseInterceptor)
    }
  )
}

describe('create request with custom config and wrapper', () => {
  it('same instance', () => {
    assert.strictEqual(true, baseRequest.wrapper instanceof Request)
    assert.strictEqual(true, isObject(baseRequest.wrapper.config))
  })

  const request = customRequest2(customRequest(baseRequest))

  describe('wrap Request', () => {
    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))
    })

    it('same config', () => {
      const config = { ...request.wrapper.config }
      assert.strictEqual('/api', config.baseURL)
      assert.strictEqual(10000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(2, Object.keys(config.headers).length)
      assert.strictEqual('test@example.com', config.headers['X-Debug-User'])
      assert.strictEqual(undefined, config.headers['X-Key'])
      assert.strictEqual(true, isArray(config.afterInitFns))
      assert.strictEqual(true, isEmpty(config.afterInitFns))
      assert.strictEqual(true, config.isResponseWrap)
      assert.strictEqual(true, isObject(config.responseWrapper))
    })
  })

  describe('checking Axios', () => {
    it('same instance', () => {
      assert.strictEqual(true, isFunction(request))
    })

    it('same config', () => {
      // console.log(request.interceptors.response)
      assert.strictEqual(false, isEmpty(request.interceptors.response.handlers))
      assert.strictEqual(true, isEmpty(request.interceptors.request.handlers))
    })
  })
})
