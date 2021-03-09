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
  describe('checking Request', () => {
    const request = customRequest({ timeout: 60000 })
    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))

      assert.strictEqual(true, isObject(request.wrapper.interceptors))
      assert.strictEqual(true, isArray(request.wrapper.interceptors.request))
      assert.strictEqual(true, isArray(request.wrapper.interceptors.response))
      assert.strictEqual(true, isEmpty(request.wrapper.interceptors.request))
      assert.strictEqual(true, request.wrapper.interceptors.response.length === 1)
    })

    it('same config', () => {
      const config = request.wrapper.config
      assert.strictEqual('/api', config.baseURL)
      assert.strictEqual(60000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(2, Object.keys(config.headers).length)
      assert.strictEqual('test@example.com', config.headers['X-Debug-User'])
      assert.strictEqual(true, config.isResponseWrap)
      assert.strictEqual(true, isObject(config.responseWrapper))
    })
  })

  describe('checking Axios', () => {
    const request = customRequest({ timeout: 60000 })
    it('same instance', () => {
      assert.strictEqual(true, isFunction(request))
    })

    it('same config', () => {
      assert.strictEqual(false, isEmpty(request.interceptors.response.handlers))
      assert.strictEqual(true, isEmpty(request.interceptors.request.handlers))
    })
  })
})
