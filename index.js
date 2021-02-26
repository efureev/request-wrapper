import Request from './src/Request'

const request = (config = {}) => {
  return new Request(config)
}

export default request

export { Request }
