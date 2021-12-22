import { LibItem } from '../shared'

export const AntdResolver: LibItem = {
  libName: 'antd',
  style(name) {
    return `antd/es/${name}/style/css.js`
  }
}

