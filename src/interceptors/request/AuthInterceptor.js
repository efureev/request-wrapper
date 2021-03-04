const AuthInterceptor = (options) => (config) => {
  if (options.auth) {
    config.headers.Authorization = options.auth
  } else {
    delete config.headers.Authorization
  }
}

export default AuthInterceptor
