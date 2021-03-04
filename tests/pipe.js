import { Request } from '../index'

import assert from 'assert'
import { isArray, isEmpty, isFunction, isObject } from '@feugene/mu/src/is'
import { customRequest as customRequestBuilder } from './custom-config'

const baseRequest = customRequestBuilder({ timeout: 30000 })

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
      instance.config.baseURL += '/module'
      instance.config.headers['X-Key'] = 'test'
    }
  )
}

const customRequest2 = (axiosInstance) => {
  return axiosInstance.reconfigure(
    /**
     * @param {Request} instance
     */
    (instance) => {
      instance.config.isResponseWrap = false
    }
  )
}

describe('create request with custom config and wrapper', () => {
  it('same instance', () => {
    assert.strictEqual(true, baseRequest.wrapper instanceof Request)
    assert.strictEqual(true, isObject(baseRequest.wrapper.config))
  })

  const request = customRequest(baseRequest)
  const config = { ...request.wrapper.config }

  describe('wrap Request', () => {
    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))
    })

    it('same config', () => {
      assert.strictEqual('/api/module', config.baseURL)
      assert.strictEqual(30000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(3, Object.keys(config.headers).length)
      assert.strictEqual('test@example.com', config.headers['X-Debug-User'])
      assert.strictEqual('test', config.headers['X-Key'])
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

  describe('reconfigure again', () => {
    const request2 = customRequest2(request)

    it('same instance', () => {
      assert.strictEqual(true, isFunction(request2))
      assert.strictEqual(true, request2.wrapper instanceof Request)
      assert.strictEqual(false, request2.wrapper.config.isResponseWrap)
      assert.strictEqual(null, request2.wrapper.config.responseWrapper)
    })

    it('same config', () => {
      assert.strictEqual(true, isEmpty(request2.interceptors.response.handlers))
      assert.strictEqual(true, isEmpty(request2.interceptors.request.handlers))
    })
  })
})
