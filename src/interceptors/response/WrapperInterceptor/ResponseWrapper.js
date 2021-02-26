import { forEach } from '@feugene/mu/src'
import { select } from '@feugene/mu/src/object'
import { isArray, isBlob, isEmpty, isObject } from '@feugene/mu/src/is'
import { buildAction } from './actions'

/**
 * Create instance, which represent response object
 * @param {Object} axiosResponse Axios Response
 * @param {Object} options = {dataKey:'data'}
 */
export default class ResponseWrapper {
  constructor(axiosResponse, options = { dataKey: 'data', statusKey: 'status' }) {
    this.type = 'mixed'
    this.options = { ...options }

    this.datas = {
      data: {},
      extra: {},
    }

    this.action = null

    this.setResponse(axiosResponse)
  }

  setResponse(response) {
    this.response = response

    return this.setData().setExtraData().setMessageData().setAction()
  }

  setData() {
    const data = !isEmpty(this.options.dataKey) ? this.response.data[this.options.dataKey] : this.response.data

    if (isObject(data)) {
      this.datas.data = { ...data }
      this.type = 'entity'
    } else if (isArray(data)) {
      this.datas.data = [...data]
      this.type = 'collection'
    } else if (isBlob(data)) {
      this.datas.data = data
      this.type = 'blob'
    } else {
      this.datas.data = data
      if (isEmpty(this.options.dataKey)) {
        this.type = 'content'
      } else {
        this.type = 'mixed'
      }
    }

    return this
  }

  setExtraData() {
    if (this.options.dataKey) {
      forEach(this.response.data, (value, key) => {
        if (key !== this.options.dataKey && key !== 'message') {
          this.datas.extra[key] = value
        }
      })
    }
    return this
  }

  setMessageData(message = null) {
    if (this.type !== 'blob') {
      this.message = message === null ? this.response.data.message : message
    }

    return this
  }

  setAction() {
    if (this.type !== 'blob') {
      this.action = buildAction(this.extra(this.options.statusKey))
    } else {
      this.action = buildAction({ type: 'blob' })
    }

    return this
  }

  /**
   * @example resp.get('response.data')
   * @example resp.get('data')
   * @example resp.get('extra')
   * @example resp.get('extra.meta')
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return select(this.datas, key)
  }

  /**
   * Получение основных данных
   *
   * @param {string|null} parameter
   * @return {*}
   */
  data(parameter = null) {
    return this.get(`data${parameter ? `.${parameter}` : ''}`)
  }

  /**
   * Получение дополнительных данных
   *
   * @param {string|null} parameter
   * @return {*}
   */
  extra(parameter = null) {
    return this.get(`extra${parameter ? `.${parameter}` : ''}`)
  }

  runAction(axiosConfig, response) {
    if (!this.action) {
      return
    }

    this.action.run(axiosConfig, response)
  }
}
