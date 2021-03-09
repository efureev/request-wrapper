# request-wrapper

## Basic usage

Response wrapper with no data-key. All response data is in native `response.data` scope.
It's used to get content of a response. Example: content of a file. 
```js
request({ responseWrapper: { dataKey: null } })
.get('download', { params: { disk, path } })
    .then(response=>{
      console.log(response.data())
    })
```

Response wrapper with data-key. By default, data-key is `data`.
It's used to get data from json response. Example json:
```json
{
  "data": {
    "id": 1,
    "name": "test"
  }
}
```
```js
request().get('list')
.then(response=>{
  console.log(response.data()
)})
```

## Use in package

`<package>/request/index.js`:

```js
const fmApiPath = process.env.VUE_APP_LFM_PATH || 'file-manager'

const wrapRequest = axiosInstance => {
  return axiosInstance.reconfigure(
    instance => {
      instance.config.baseURL += `/${fmApiPath}`
      instance.registerRequestInterceptors(LoadingRequestInterceptor)
      instance.registerResponseInterceptors(LoadingResponseInterceptor, ResponseNoticeInterceptor)
    }
  )
}

const request = config => {
  return wrapRequest(Vue.prototype.$request(config))
}

export default request
```

use package's request in application

`<app>/request/index.js`:

```js
import buildBaseRequest from '@feugene/request'

const basePath = process.env.VUE_APP_BASE_PATH

const request = store => (config = {}) => {
  const headers = {
    ...(isObject(config.headers) ? config.headers : {}),
  }

  const mergedConfig = {
    baseURL: basePath,
    ...config,
    headers,
  }

  mergedConfig.store = store

  return buildBaseRequest(mergedConfig)
}

export default request

```

`<aap>/main.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'
import request from './request'
Vue.use(Vuex)

const store = new Vuex.Store()
Vue.prototype.$request = request(store)
```
