import { LibItem } from '../shared'

const ElementPlusResolver: LibItem = {
  libName: 'element-plus',
  libDirectory: 'es/components',
  nameFormatter: (name) => {
    return name.replace('el-', '')
  },
  style: (name) => {
    if (['el-config-provider', 'effect'].includes(name)) return false;
    return `element-plus/es/components/${name.replace('el-', '')}/style/css.js`;
  },
}

export default ElementPlusResolver
