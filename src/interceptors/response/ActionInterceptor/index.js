import axios from 'axios'
import { buildAction } from './actions'

const ActionInterceptor = (options) =>
  /**
   * @param {ResponseWrapper} response
   * @return {*}
   */
    (response) => {

    const action = buildAction(!response.isBinary()
      ? response.extra(response.options.statusKey)
      : { type: 'blob' },
    )

    if (action){
      action.run(options, response)
      throw new axios.Cancel({
        action,
      })
    }

    return response
  }

export default ActionInterceptor
