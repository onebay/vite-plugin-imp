import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import vitePluginImp from 'vite-plugin-imp'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;
export default defineConfig({
  plugins: [
    createVuePlugin(),
    vitePluginImp({
      libList: [
        {
          libName: 'element-ui',
          libDirectory: 'lib',
          nameFormatter: (name) => {
            return name.replace('el-', '')
          },
          style: (name) => `element-ui/lib/theme-chalk/${name.replace('el-', '')}.css`,
        },
        {
          libName: 'vuetify',
          libDirectory: 'lib/components',
          replaceOldImport: true,
          style: () => false,
          camel2DashComponentName: false
        }
      ]
    }),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : null,
  ].filter(Boolean)
})
