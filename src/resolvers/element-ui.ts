import { LibItem } from '../shared'

const ElementUIResolver: LibItem = {
  libName: 'element-ui',
  libDirectory: 'lib',
  nameFormatter: (name) => {
    return name.replace('el-', '')
  },
  style: (name) => `element-ui/lib/theme-chalk/${name.replace('el-', '')}.css`,
}

export default ElementUIResolver
