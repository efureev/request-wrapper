const ConsoleResponseInterceptor = (options) => (response) => {
  console.log('run ConsoleResponseInterceptor')

  return response
}

export default ConsoleResponseInterceptor
