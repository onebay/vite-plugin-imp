import { LibResolver } from '../types'

export const ArcoDesignReactResolver: LibResolver = {
  libName: '@arco-design/web-react',
  style: (name) => `@arco-design/web-react/es/${name}/style/css.js`
}

