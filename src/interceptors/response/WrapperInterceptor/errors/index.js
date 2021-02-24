import ValidationError from './ValidationError'
import HttpError from './HttpError'
import ConflictError from './ConflictError'

export default function make(error) {
  const status = error?.response?.status

  switch (status) {
    case 409:
      return new ConflictError(error)
    case 422:
      return new ValidationError(error)
    default:
      return new HttpError(error)
  }
}
