import BaseAction from './BaseAction'

export default class DownloadAction extends BaseAction {
  constructor(data) {
    super(data)

    this.url = data.url
    this.name = data.name
  }

  run(axiosConfig) {
    const link = document.createElement('a')

    link.href = this.url
    if (this.name) {
      link.download = this.name
    }

    document.body.append(link)
    link.click()
    link.remove()

    Alice.route(this.url)
  }
}
