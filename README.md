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

config interface is ImpConfig:
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
  /**
   * when a style path is not found, don’t show error and give a warning. 
   * Default: command === 'serve'
   */
  ignoreStylePathNotFound?: boolean
  /**
   * By default `vite-plugin-imp` ignores all files inside node_modules. 
   * You can enable this option to avoid unexpected untranspiled code from third-party dependencies.
   * 
   * Transpiling all the dependencies could slow down the build process, though. 
   * If build performance is a concern, you can explicitly transpile only some of the dependencies 
   * by passing an array of package names or name patterns to this option.
   * 
   * Default: false
   */
  transpileDependencies?: boolean | Array<string | RegExp>
}
```

## More libraries usage
```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({
  plugins: [
    // ...
    vitePluginImp({
      libList: [
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false
        },
        {
          libName: 'antd',
          style(name) {
            // use less
            return `antd/es/${name}/style/index.js`
          }
        },
      ]
    })
  ]
})
```

## Built-in Support popular library
- [antd-mobile](./src/resolvers/antd-mobile.ts)
- [antd](./src/resolvers/antd.ts)
- [ant-design-vue](./src/resolvers/antdv.ts)
- [@arco-design/web-react](./src/resolvers/arco-design-react.ts)
- [@arco-design/web-vue](./src/resolvers/arco-design-vue.ts)
- [element-plus](./src/resolvers/element-plus.ts)
- [element-ui](./src/resolvers/element-ui.ts)
- [lodash](./src/resolvers/lodash.ts)
- [underscore](./src/resolvers/underscore.ts)
- [vant](./src/resolvers/vant.ts)
- [view ui](./src/resolvers/view-ui.ts)
- [vuetify](./src/resolvers/vuetify.ts)

If your project is using libraries that mentioned above, you just need use it like: 
```ts
export default defineConfig({
  plugins: [
    // ...
    vitePluginImp()
  ]
})
```
If you want to support a library built-in, feel free to open a issue.


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
