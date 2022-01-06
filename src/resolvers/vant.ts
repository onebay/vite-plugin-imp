import { LibResolver } from '../types'

export const VantResolver: LibResolver = {
  libName: 'vant',
  replaceOldImport: false,
  style: (name) => `vant/es/${name}/style/index.js`
}
