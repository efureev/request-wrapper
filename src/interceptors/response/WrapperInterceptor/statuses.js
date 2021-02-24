export const S200 = 'All done. Request successfully executed'
export const S201 = 'Data successfully created'
export const S204 = 'Not Content'

export const S400 = 'Bad Request'
export const S401 = 'Need auth'
export const S404 = 'Not found'
export const S422 = 'Unprocessable Entity'

export const S500 = 'Server error'
export const S503 = 'Service Unavailable'

/**
 * Return message for HTTP status code
 *
 * @param {number} status - HTTP status code
 * @returns {string} Message of network operation
 */
export default function statusMessage(status) {
  let message = ''
  switch (status) {
    case 200:
      message = S200
      break
    case 201:
      message = S201
      break
    case 204:
      message = S204
      break
    case 400:
      message = S400
      break
    case 401:
      message = S401
      break
    case 404:
      message = S404
      break
    case 422:
      message = S422
      break
    case 500:
      message = S500
      break
    case 503:
      message = S503
      break
    default:
      message = 'Something wrong. Client default error message'
      break
  }
  return message
}
