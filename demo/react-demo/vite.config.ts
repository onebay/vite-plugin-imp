import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style(name) {
            return `antd/es/${name}/style/css.js`
          }
        },
        {
          libName: '@arco-design/web-react',
          style(name) {
            return `@arco-design/web-react/es/${name}/style/css.js`
          }
        },
        {
          libName: 'antd-mobile',
          style(name) {
            return `antd-mobile/es/${name}/style/css.js`
          }
        }
      ]
    }),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : null,
  ].filter(Boolean)
})
