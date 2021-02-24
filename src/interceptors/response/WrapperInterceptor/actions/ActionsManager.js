class ActionsManager {
  constructor() {
    this.list = {}
  }

  add(type, action) {
    this.list = action
  }

  get(type) {
    return this.list[type] ?? null
  }
}

const manager = new ActionsManager()

export default manager
