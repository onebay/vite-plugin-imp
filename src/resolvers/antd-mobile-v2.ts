import { LibResolver } from '../types'

export const AntdMobileReactResolver: LibResolver = {
  libName: 'antd-mobile',
  style: (name) => `antd-mobile/es/${name}/style/css.js`
}
