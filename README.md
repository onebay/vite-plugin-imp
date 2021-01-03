# vite-plugin-imp

A vite plugin for import style automatic.

## support
```
vite >= 1.0.0-rc.13 (vite 2.0.0 not yet)
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