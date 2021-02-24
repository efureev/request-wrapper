import { isEmpty, isObject } from '@feugene/mu/src/is'
import DownloadAction from './DownloadAction'
import BlobAction from './BlobAction'
import RedirectAction from './RedirectAction'
import manager from './ActionsManager'

manager.add('download', DownloadAction)
manager.add('blob', BlobAction)
manager.add('redirect', RedirectAction)

export function buildAction(data) {
  if (!isObject(data) || isEmpty(data.type)) {
    return null
  }

  const action = manager.get(data.type)
  if (!action) {
    return null
  }

  return new action(data)
}
