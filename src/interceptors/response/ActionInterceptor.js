import axios from 'axios'
import isFunction from '@feugene/mu/src/is/isFunction'

const ActionInterceptor = (options) => (response) => {
  const { action } = response

  if (action && isFunction(response.runAction)) {
    response.runAction(response.response.config, response)
    throw new axios.Cancel({
      action,
    })
  }

  return response
}

export default ActionInterceptor
