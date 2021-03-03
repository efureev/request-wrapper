import statusMessage from '../statuses'
import { select } from '@feugene/mu/src/object'

/**
 * Create instant, which represent error object
 * @param {Object} [error] - axios error object
 */
export default class HttpError extends Error {
  constructor(error) {
    super()

    this.name = 'HttpError'
    this.stack = error.stack || new Error().stack

    this.request = error?.request

    this.setResponse(error?.response)

    if (error.isAxiosError) {
      this.config = error.config
      this.url = error.request.responseURL
    }
  }

  setResponse(response) {
    this.response = response

    if (this.hasResponse()) {
      this.data = this.response.data

      this.setStatus(response.status).setMessage()
    }

    return this
  }

  setStatus(code) {
    this.statusCode = code
    this.statusText = statusMessage(code)

    return this
  }

  setMessage(message = null) {
    if (!message) {
      message = this.response?.data?.message
    }

    this.message = message

    return this
  }

  hasResponse() {
    return !!this.response
  }

  toHtml() {
    return `<div><div class="title">${this.message}</div><ul class="details list-reset">${
      this.statusCode && this.statusText ? `<li>[${this.statusCode}] ${this.statusText}</li>` : ''
    }<li>[url] ${this.url}</li></ul></div>`
  }

  /**
   * @example errorWrap.get('response.data')
   * @param key
   * @return {*}
   */
  get(key) {
    return select(this, key)
  }
}
