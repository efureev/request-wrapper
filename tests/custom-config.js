import buildBaseRequest, { Request } from '../index'

import assert from 'assert'
import { isArray, isEmpty, isFunction, isObject } from '@feugene/mu/src/is'

export const customRequest = (config = {}) => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Debug-User': 'test@example.com',
    ...(isObject(config.headers) ? config.headers : {}),
  }

  const mergedConfig = {
    baseURL: '/api',
    ...config,
    headers,
  }

  return buildBaseRequest(mergedConfig)
}

describe('create request with base custom config', () => {
  const request = customRequest({ timeout: 60000 })

  describe('checking Request', () => {
    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))
    })

    it('same config', () => {
      const config = request.wrapper.config
      assert.strictEqual('/api', config.baseURL)
      assert.strictEqual(60000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(2, Object.keys(config.headers).length)
      assert.strictEqual('test@example.com', config.headers['X-Debug-User'])
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
