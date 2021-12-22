import { LibItem } from '../shared'

const defaultLibList: LibItem[] = [
  {
    libName: 'antd',
    style(name) {
      return `antd/es/${name}/style/css.js`
    }
  },
  {
    libName: 'ant-design-vue',
    style: (name) => `ant-design-vue/es/${name}/style/css.js`
  },
  {
    libName: 'element-plus',
    libDirectory: 'es/components',
    nameFormatter: (name) => {
      return name.replace('el-', '')
    },
    style: (name) => {
      if (['el-config-provider', 'effect'].includes(name)) return false;
      return `element-plus/es/components/${name.replace('el-', '')}/style/css.js`;
    },
  },
  {
    libName: 'element-ui',
    libDirectory: 'lib',
    nameFormatter: (name) => {
      return name.replace('el-', '')
    },
    style: (name) => `element-ui/lib/theme-chalk/${name.replace('el-', '')}.css`,
  },
  {
    libName: 'lodash',
    libDirectory: '',
    camel2DashComponentName: false
  },
  {
    libName: 'underscore',
    libDirectory: 'modules',
    camel2DashComponentName: false,
  },
  {
    libName: 'vant',
    style: (name) => `vant/es/${name}/style/index.js`
  },
  {
    libName: 'vuetify',
    libDirectory: 'lib/components',
    replaceOldImport: true,
    style: () => false,
    camel2DashComponentName: false
  },
]

export default defaultLibList
