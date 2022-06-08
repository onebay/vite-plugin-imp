import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import vitePluginImp from '../../dist/index.cjs'
import { visualizer } from 'rollup-plugin-visualizer'

const { ANALYZE } = process.env;
export default defineConfig({
  plugins: [
    createVuePlugin(),
    vitePluginImp(),
    ANALYZE === '1' ? visualizer({ open: true, filename: 'visualizer/stat.html' }) : null,
  ].filter(Boolean)
})
