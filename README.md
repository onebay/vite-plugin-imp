# vite-plugin-imp

- A vite plugin for import ui library component style automatic.  
- It can also import library like lodash on demand.  

``` js
import { forEach } from 'lodash'

forEach([1,2], console.log)
```
to  
```js
import forEach from 'lodash/forEach'

forEach([1,2], console.log)
```
<hr/>

``` js
import { Progress } from 'vant'
```
to
``` js
import { Progress } from 'vant'
import 'vant/es/progress/style/index.js'
```


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
export interface LibItem {
  /**
   * library name
   */
  libName: string
  /**
   * component style file path
   */
  style: (name: string) => string | string[] | boolean
  /**
   * default `es`
   */
  libDirectory?: string
  /**
   * whether convert component name from camel to dash
   */
  camel2DashComponentName?: boolean
  /**
   * whether replace old import statement, default `command === 'build'`,
   * that means in vite serve default to `false`, in vite build default to `ture`
   */
  replaceOldImport?: boolean
}

interface ImpConfig {
  libList: libItem[]
  /**
   * exclude the library from defaultLibList
   */
  exclude?: string[]
}
```

# Support popular library
- antd
- ant-design-vue
- element-plus
- element-ui
- lodash
- underscore
- vant
- vuetify

If your project is using libraries that mentioned above, you just need use it like: 
```ts
export default defineConfig({
  plugins: [
    // ...
    vitePluginImp()
  ]
})
```

## More libraries usage
```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({
  optimizeDeps: {
    entries: 'vant/es/**/*.js'
  },
  plugins: [
    vue(), 
    vitePluginImp({
      libList: [
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
          style(name) {
            if (/CompWithoutStyleFile/i.test(name)) {
              // This will not import any style file 
              return false
            }
            return `vant/es/${name}/style/index.js`
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
        {// for element-plus < v1.1
          libName: 'element-plus',
          style: (name) => {
            return`element-plus/lib/theme-chalk/${name}.css`
          }
        },
        {// for element-plus >= v1.1
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
