import { LibResolver } from '../types'

export const AntDesignVueResolver: LibResolver = {
  libName: 'ant-design-vue',
  style: (name) => `ant-design-vue/es/${name}/style/css.js`
}
