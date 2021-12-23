import { LibResolver } from '../types'

export const AntdResolver: LibResolver = {
  libName: 'antd',
  style(name) {
    return `antd/es/${name}/style/css.js`
  }
}

