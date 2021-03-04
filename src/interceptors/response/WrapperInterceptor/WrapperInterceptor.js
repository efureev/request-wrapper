import makeError from '../../../errors'
import ResponseWrapper from './ResponseWrapper'
import { isFunction } from '@feugene/mu/src/is'

const WrapperInterceptor = options => [
  response => {
    return new ResponseWrapper(response, {
      dataKey: options.responseWrapper.dataKey,
      statusKey: options.responseWrapper.statusKey,
    })
  },

  error => {
    const { config } = error
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) {
      return Promise.reject(makeError(error))
    }

    if (!error.response && isFunction(options.onThrowErrorFn)) {
      return options.onThrowErrorFn(error, this)
      // @todo create none http error
      // return Promise.reject(makeError(error))
    }

    const errorWrap = makeError(error)

    return Promise.reject(errorWrap)
  },
]

export default WrapperInterceptor
