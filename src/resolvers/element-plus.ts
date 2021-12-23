import { LibResolver } from '../types'

export const ElementPlusResolver: LibResolver = {
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

