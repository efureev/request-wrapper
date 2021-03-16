import buildBaseRequest, { Request } from '../index'

import assert from 'assert'
import { isArray, isEmpty, isFunction, isNull, isObject } from '@feugene/mu/src/is'
import equal from '@feugene/mu/src/object/equals'

describe('create request by default', () => {
  const request = buildBaseRequest()

  describe('checking Request', () => {
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
      assert.strictEqual('/', config.baseURL)
      assert.strictEqual(10000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(true, equal({}, config.headers))
      assert.strictEqual(true, config.isResponseWrap)
      assert.strictEqual(true, isObject(config.responseWrapper))
    })
  })

  describe('checking Axios', () => {
    it('same instance', () => {
      assert.strictEqual(true, isFunction(request))
    })

    it('same config', () => {
      assert.strictEqual(false, isEmpty(request.interceptors.response.handlers))
      assert.strictEqual(true, isEmpty(request.interceptors.request.handlers))
    })
  })
})

describe('create request without response wrapper', () => {
  const request = buildBaseRequest({ isResponseWrap: false })

  describe('checking Request', () => {
    it('same instance', () => {
      assert.strictEqual(true, request.wrapper instanceof Request)
      assert.strictEqual(true, isObject(request.wrapper.config))
    })

    it('same config', () => {
      const config = request.wrapper.config
      assert.strictEqual('/', config.baseURL)
      assert.strictEqual(10000, config.timeout)
      assert.strictEqual(true, isObject(config.headers))
      assert.strictEqual(true, equal({}, config.headers))
      assert.strictEqual(false, config.isResponseWrap)
      assert.strictEqual(true, isNull(config.responseWrapper))
    })
  })

  describe('checking Axios', () => {
    it('same instance', () => {
      assert.strictEqual(true, isFunction(request))
    })

    it('same config', () => {
      assert.strictEqual(true, isEmpty(request.interceptors.response.handlers))
      assert.strictEqual(true, isEmpty(request.interceptors.request.handlers))
    })
  })
})
