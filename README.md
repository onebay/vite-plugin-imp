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
``` js
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
export default defineConfig({
  plugins: [vitePluginImp(config)]
})
```

config is ImpConfig
``` ts
export interface libItem {
  // library name
  libName: string
  // component style file path
  style: (name: string) => string | string[] | boolean
  // default `es`
  libDirectory?: string
}

interface ImpConfig {
  libList: libItem[]
}
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({
  plugins: [
    vue(), 
    vitePluginImp({
      libList: [
        {
          libName: 'vant',
          style(name) {
            if (/CompWithoutStyleFile/i.test(name)) {
              // This will not import any style file 
              return false
            }
            return `vant/es/${name}/index.css`
          }
        },
        {
          libName: 'ant-design-vue',
          style(name) {
            if (/popconfirm/.test(name)) {
              // support multiple style file path to import
              return [
                'ant-design-vue/es/button/style/index.css',
                'ant-design-vue/es/popover/style/index.css'
              ]
            }
            return `ant-design-vue/es/${name}/style/index.css`
          }
        },
        {
          libName: 'element-plus',
          style: (name) => {
            return`element-plus/lib/theme-chalk/${name}.css`
          }
        }
      ]
    })
  ]
})
```


just use the component like below, component style will be auto injected.

``` tsx
import { defineComponent } from 'vue'
import { Progress } from 'vant'
import { ElButton } from 'element-plus'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div>
          <Progress percentage={3} />
          <ElButton>element-plus button</ElButton>
        </div>
      )
    }
  }
})
```

You can set camel2DashComponentName to false to disable transfer from camel to dash:
``` ts
vitePluginImp({
  libList: [
    {
      libName: 'custom-lib',
      camel2DashComponentName: false, // default true
      style: (name) => {
        return`custom-lib/lib/${name}/index.css`
      }
    }
  ]
})
```
## plugin V1.x (No more updates) Usage 

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
      libraryName: 'element-plus',
      style: (name) => {
        return`element-plus/lib/theme-chalk/${name}.css`
      }
    }
  ]
})

module.exports = {
  plugins: [vitePluginImp]
}

```
