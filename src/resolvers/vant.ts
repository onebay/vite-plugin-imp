import { LibResolver } from '../types'

export const VantResolver: LibResolver = {
  libName: 'vant',
  style: (name) => `vant/es/${name}/style/index.js`
}
