# vite-plugin-imp

A vite plugin for import library component style automatic.  
## install
```
npm i vite-plugin-imp -D
```
or
```
yarn add vite-plugin-imp -D
```
## Usage
```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({
  plugins: [
    vue(), 
    vitePluginImp({
      libList: [{
        libName: 'vant',
        style(name) {
          return `vant/es/${name}/index.css`
        }
      }]
    })
  ]
})
```

just use the component like below, component style will be auto injected.

``` tsx
import { defineComponent } from 'vue'
import { Progress } from 'vant'

export default defineComponent({
  setup() {
    return () => {
      return (<Progress percentage={3} />)
    }
  }
})
```

## plugin V1.x Usage

``` js
// vite.config.js
const vitePluginImpCreator = require('vite-plugin-imp')

const vitePluginImp = vitePluginImpCreator({
  optimize: true,
  libList: [
    {
      libraryName: 'vant',
      style: (name) => {
        return `vant/es/${name}/index.css`
      }
    },
    {
      libraryName: 'element-plusi',
      style: (name) => {
        return`element-plus/lib/theme-chalk/el-${name.slice(2)}.css`
      }
    }
  ]
})

module.exports = {
  plugins: [vitePluginImp]
}

```

## API Signature
``` ts
interface libItem {
  // library name
  libName: string
  // component style file path
  style: (name: string) => string
  // default `es`
  libDirectory?: string
}

interface ImpConfig {
  libList: libItem[]
}
```
