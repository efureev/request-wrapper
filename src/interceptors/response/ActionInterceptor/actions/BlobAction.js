import BaseAction from './BaseAction'

const getFileName = (contentDisposition, value) => {
  if (contentDisposition) {
    return contentDisposition.split('filename=')[1]
  }
  if (value) {
    return value
  }

  return 'download-file'
}

export default class BlobAction extends BaseAction {
  constructor(data) {
    super(data)
  }

  run(axiosConfig, response) {
    const contentDisposition = response.response.headers['content-disposition']
    const headerFilename = response.response.headers['x-filename']
    const filename = getFileName(contentDisposition, headerFilename)

    const reader = new FileReader()

    reader.onloadend = function () {
      let url = reader.result
      url = url.replace(/^data:[^;]*;/, 'data:attachment/file;')

      const link = document.createElement('a')

      link.href = url
      link.download = filename
      link.target = '_blank'

      document.body.append(link)
      link.click()

      link.remove()
    }

    reader.readAsDataURL(
      new Blob([response.data], {
        type: response.data.type || 'application/octet-stream',
      })
    )
  }
}
