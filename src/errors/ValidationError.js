import HttpError from './HttpError'

export default class ValidationError extends HttpError {
  constructor(error) {
    super(error)

    this.name = 'ValidationError'
    this.statusCode = 422
  }

  setMessage(message = null) {
    super.setMessage(message)

    const errs = this.response?.data?.errors
    if (errs) {
      this.messageErrors = errs
    }
  }
}
