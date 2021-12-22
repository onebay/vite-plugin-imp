import { LibItem } from '../shared'

const antdResolver: LibItem = {
  libName: 'antd',
  style(name) {
    return `antd/es/${name}/style/css.js`
  }
}

export default antdResolver
