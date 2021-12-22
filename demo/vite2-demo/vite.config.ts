import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h } from 'vue'`
  },
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: 'vant',
          style(name) {
            return `vant/es/${name}/style/index.js`
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
        {
          libName: 'ant-design-vue',
          style(name) {
            if (/popconfirm/.test(name)) {
              return `ant-design-vue/es/popover/style/index.css`
            }
            return `ant-design-vue/es/${name}/style/index.css`
          }
        },
        {
          libName: 'lodash',
          libDirectory: '',
          camel2DashComponentName: false,
          style: () => {
            return false;
          },
        },
      ]
    }),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : null,
  ].filter(Boolean)
})
