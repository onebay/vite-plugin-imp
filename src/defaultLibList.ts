import { LibItem } from './shared'

const defaultLibList: LibItem[] = [
  {
    libName: 'lodash',
    libDirectory: '',
    camel2DashComponentName: false,
    style: () => {
      return false;
    },
  },
  {
    libName: 'vant',
    style: (name) => `vant/es/${name}/style/index.js`
  },
  {
    libName: 'ant-design-vue',
    style: (name) => `ant-design-vue/es/${name}/style/css.js`
  },
  {
    libName: 'element-ui',
    nameFormatter: (name) => {
      return name.replace('el-', '')
    },
    style(name) {
      return `element-ui/lib/theme-chalk/${name}.css`
    } 
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
]

export default defaultLibList
