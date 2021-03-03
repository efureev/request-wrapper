import HttpError from './HttpError'

export default class ConflictError extends HttpError {
  constructor(error) {
    super(error)

    this.name = 'ConflictError'
    this.statusCode = 409
  }
}
