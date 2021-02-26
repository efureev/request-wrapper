# request-wrapper

Response wrapper with no data-key. All response data is in native `response.data` scope.
It's used to get content of a response. Example: content of a file. 
```js
request({ responseWrapper: { dataKey: null } }).get('download', { params: { disk, path } })
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
