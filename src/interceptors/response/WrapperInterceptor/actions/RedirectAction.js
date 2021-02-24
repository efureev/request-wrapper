import BaseAction from './BaseAction'

export default class RedirectAction extends BaseAction {
  constructor(data) {
    super(data)
    this.url = data.url
  }

  run(axiosConfig) {
    if (/^http(s)?:\/\//.test(this.url)) {
      window.location = this.url
      return
    }

    window.location = new URL(window.location.origin + this.url)
  }
}
