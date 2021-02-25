import ResponseWrapper from './ResponseWrapper'
import makeError from './errors'
import { isFunction } from '@feugene/mu/src/is'

const WrapperInterceptor = options => [
  response => {
    return new ResponseWrapper(response, {
      dataKey: options.responseWrap.dataKey,
      statusKey: options.responseWrap.statusKey,
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
